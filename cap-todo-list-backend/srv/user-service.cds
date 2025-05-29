using { sap.capire.todolist as my } from '../db/schema';

@impl: 'srv/user-service.js'

service UserService @(path:'/browse'){
    entity Tasks as projection on my.Tasks;
    entity User as projection on my.User;
    
    // defines all custom actions
    action doTask(task: Integer, done: Boolean);
    action createTask(user: Integer, title: String(111));
    action getTasks(user: Integer) returns array of Tasks;
    action login(username:String(111), password:String(111)) returns Integer;
    action register(username:String(111), password:String(111)) returns Integer;
    
}