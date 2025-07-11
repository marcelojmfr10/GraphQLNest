import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput, UpdateTodoInput } from './dto/inputs';

@Injectable()
export class TodoService {

    private todos: Todo[] = [
        { id: 1, description: 'comprar la comida', done: false },
        { id: 2, description: 'comprar la ropa', done: false },
        { id: 3, description: 'comprar las tortillas', done: true },
    ];

    findAll(): Todo[] {
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

    update(updateTodoInput: UpdateTodoInput) {
        const {id, description, done} = updateTodoInput;

        const todoUpdate = this.findOne(id);

        if(description) todoUpdate.description = description;
        if(done !== undefined) todoUpdate.done = done;

        this.todos = this.todos.map(todo => {
            return (todo.id === id) ? todoUpdate : todo;
        });

        return todoUpdate;
    }

}
