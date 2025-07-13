import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput, UpdateTodoInput, StatusArgs } from './dto';

@Injectable()
export class TodoService {

    private todos: Todo[] = [
        { id: 1, description: 'comprar la comida', done: false },
        { id: 2, description: 'comprar la ropa', done: false },
        { id: 3, description: 'comprar las tortillas', done: true },
        { id: 4, description: 'comprar las sopas', done: true },
    ];

    get totalTodos() {
        return this.todos.length;
    }

    get completedTodos() {
        return this.todos.filter(todo => todo.done === true).length;
    }

    get pendingTodos() {
        return this.todos.filter(todo => todo.done === false).length;
    }

    findAll(statusArgs: StatusArgs): Todo[] {
        const {status} = statusArgs;

        if(status !== undefined) return this.todos.filter(todo => todo.done === status);

        return this.todos;
    }

    findOne(id: number): Todo {
        const todo = this.todos.find(todo => todo.id === id);
        if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);

        return todo;
    }

    create(createTodoInput: CreateTodoInput): Todo {
        const todo = new Todo();
        todo.description = createTodoInput.description;
        todo.id = Math.max(...this.todos.map(todo => todo.id), 0) + 1;

        this.todos.push(todo);
        return todo;
    }

    update(id: number, updateTodoInput: UpdateTodoInput) {
        const { description, done } = updateTodoInput;

        const todoUpdate = this.findOne(id);

        if (description) todoUpdate.description = description;
        if (done !== undefined) todoUpdate.done = done;

        this.todos = this.todos.map(todo => {
            return (todo.id === id) ? todoUpdate : todo;
        });

        return todoUpdate;
    }

    delete(id: number) {
        const todo = this.findOne(id);

        this.todos = this.todos.filter(todo => todo.id !== id);
        return true;
    }

}
