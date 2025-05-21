import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/services/clients.service';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private usersService: UsersService,
    private clientsService: ClientsService,
    private emailsService: EmailsService
  ) {}

  async create(createTaskDto: CreateTaskDto, currentUserId: string): Promise<Task> {
    // Verify client exists
    const client = await this.clientsService.findOne(createTaskDto.clientId);
    if (!client) {
      throw new NotFoundException(`Client with ID ${createTaskDto.clientId} not found`);
    }

    // Verify assignee exists if provided
    if (createTaskDto.assigneeId) {
      const assignee = await this.usersService.findOne(createTaskDto.assigneeId);
      if (!assignee) {
        throw new NotFoundException(`User with ID ${createTaskDto.assigneeId} not found`);
      }
    }

    // Create task
    const task = this.tasksRepository.create({
      ...createTaskDto,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      creatorId: currentUserId
    });

    const savedTask = await this.tasksRepository.save(task);

    // Send notification email to assignee if provided
    if (createTaskDto.assigneeId) {
      await this.notifyAssignee(savedTask);
    }

    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: ['client', 'assignee', 'creator'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByClient(clientId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { clientId },
      relations: ['assignee', 'creator'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByAssignee(assigneeId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { assigneeId },
      relations: ['client', 'creator'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['client', 'assignee', 'creator']
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    
    // Check if assignee has changed
    const assigneeChanged = updateTaskDto.assigneeId && updateTaskDto.assigneeId !== task.assigneeId;
    
    // Update task fields
    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined) task.description = updateTaskDto.description;
    if (updateTaskDto.status) task.status = updateTaskDto.status;
    if (updateTaskDto.priority) task.priority = updateTaskDto.priority;
    if (updateTaskDto.dueDate) task.dueDate = new Date(updateTaskDto.dueDate);
    if (updateTaskDto.assigneeId) task.assigneeId = updateTaskDto.assigneeId;

    const updatedTask = await this.tasksRepository.save(task);

    // Send notification to new assignee if changed
    if (assigneeChanged) {
      await this.notifyAssignee(updatedTask);
    }

    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }

  private async notifyAssignee(task: Task): Promise<void> {
    // Get assignee details
    const assignee = await this.usersService.findOne(task.assigneeId);
    if (!assignee || !assignee.email) {
      return;
    }

    // Get client details
    const client = await this.clientsService.findOne(task.clientId);

    // Send notification email
    try {
      await this.emailsService.sendTaskAssignmentEmail({
        to: assignee.email,
        taskTitle: task.title,
        taskDescription: task.description || '',
        dueDate: task.dueDate ? task.dueDate.toLocaleDateString('fr-FR') : 'Non spécifiée',
        clientName: client && client.contactInfo ? `${client.contactInfo.firstName} ${client.contactInfo.lastName}` : 'Client',
        taskId: task.id
      });
    } catch (error) {
      console.error('Failed to send task assignment email:', error);
      // Continue flow even if email fails
    }
  }
}