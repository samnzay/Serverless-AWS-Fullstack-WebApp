import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodoDBAccess')

// TODO: Implement the dataLayer logic

//Implement Basic Data AccessLevel Logic
//=======================================
export class TodoDBAccess{
    constructor (
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly theTodosTable = process.env.TODOS_TABLE
    ){}

    
    //Get all Todos
    //=============
    async GetAllTodoList(userId: String): Promise<TodoItem[]> {
        try{//handle Errors that could happen with Getting all Todos list
            console.log('Retrieve all Todos List')
            const todoItems = await this.docClient
                .query({
                    TableName: this.theTodosTable,
                    KeyConditionExpression: '#userId = :userId',
                    ExpressionAttributeNames:{
                        '#userId':'userId'
                    },
                    ExpressionAttributeValues:{
                        ':userId': userId
                    }   

                }).promise()
                console.log(todoItems)
                //logger.info(todoItems)

                const resultedItems = todoItems.Items

                return resultedItems as TodoItem[]

            }catch(e){
                if (e instanceof Error){
                    console.log('Something went wrong with Fetching TodoItems: ', e.message)
                    //logger.error('Something went wrong with Fetching TodoItems: ', e.message)

                }
            }
        }

    //CREATE TODO
    //===========
    async CreateTodoItem(createTodoItem: TodoItem): Promise<TodoItem> {

        try{//Handle Errors that could happen during Item creation
            console.log('new Todo Item being create in Todos Table')

            await this.docClient.put({
                TableName: this.theTodosTable,
                Item: createTodoItem
            }).promise()

            return createTodoItem

        }catch(e){
            if(e instanceof Error){
                console.log('ooh Something went wrong with Creating Todo Item: ', e.message)
                logger.error('ooh Something went wrong with Creating Todo Item: ', e.message)
            }
        }
    } 

    //UPDATE TODO ITEM
    //================

    async UpdateTodo(todoItemUpdate: TodoUpdate,  userId: string, todoItemId: string): Promise<TodoUpdate>{
        try{ //Handle errors that could happen during item update

            logger.info('Updating Item inprogress')
            const updateItemResult= await this.docClient.update({
                TableName: this.theTodosTable,

                Key:{
                    userId: userId,
                    todoId: todoItemId
                },
                UpdateExpression:
                    'SET #name = :name, #dueDate = :dueDate, #done= :done',
                ExpressionAttributeNames:{
                    '#name': 'todoItemName',
                    '#dueDate': 'ItemDueDate',
                    '#done': 'itemStatus'
                },
                ExpressionAttributeValues:{
                    ':name': todoItemUpdate['name'],
                    ':dueDate': todoItemUpdate['dueDate'],
                    ':done': todoItemUpdate['done']
                },

                ReturnValues: 'ALL_NEW'

            }).promise()
            //console.log('Todo Item Updated Successfully', updateItemResult)
            logger.info('Todo Item Updated Successfully', updateItemResult)

            const todoItem_attributes = updateItemResult.Attributes
            return todoItem_attributes as TodoUpdate

        }catch(e){
            if (e instanceof Error){
                //console.log('Something went wrong with TodoItem Update: ', e.message)
                logger.error('Something went wrong with TodoItem Update: ', e.message)
            }
        }
    }
    
    //Detete TodoItem
    //===============

    async DeleteTodoItem(userId: string, todoItemId: string ): Promise<string>{
        try{//Handle Errors with Item Deletion
            await this.docClient.delete({
                TableName: this.theTodosTable,
    
                Key:{
                    userId: userId,
                    todoId: todoItemId
                }
            }).promise()
            console.log('Todo Item Deleted')
    
            return ('Todo Item Deleted from DB')

        }catch(e){
            if(e instanceof Error){
                console.log('Something went wrong with Item Deletion: ', e.message)
                logger.error('Something went wrong with Item Deletion: ', e.message)
            }
        }
    }
}