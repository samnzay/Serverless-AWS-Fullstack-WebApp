import { TodoDBAccess } from '../dataLayer/todosAcess'
import { attachmentBucket } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

// TODO: Implement businessLogic

//BUSINESS LOGIC
//==============
const todoDBAccess = new TodoDBAccess()

//List All Items
export async function ListAllTodos(userId: string): Promise<TodoItem[]>{

    return todoDBAccess.GetAllTodoList(userId)//Get all items based on the current loggedIn User
}

//Create New Todo item
export function CreateNewTodoItem(createNewItemRequest: CreateTodoRequest, userId: string): Promise<TodoItem>{
    const todoItemId = uuid()//Generate Item Id
    const createAt = new Date().toISOString()

    const createItemParams = {
        userId: userId,
        todoId: todoItemId,
        attachmentUrl: `https://${attachmentBucket}.s3.amazonaws.com/${todoItemId}`,
        createdAt: createAt,
        done: false,
        ...createNewItemRequest
    }

    return todoDBAccess.CreateTodoItem(createItemParams)

}

//Delete Todo item
//=================
export function deleteTodo(userId:string, todoId:string): Promise<string>{
    return todoDBAccess.DeleteTodoItem(userId, todoId)
}

//Update Item Logic
//=================
export function UpdateTodo(updateItemRequest: UpdateTodoRequest, userId: string, todoId: string): Promise<TodoUpdate>{
    return todoDBAccess.UpdateTodo(updateItemRequest, userId, todoId)
}
    
