using { managed, sap } from '@sap/cds/common';

namespace sap.capire.todolist;

entity User : managed {
    key ID : Integer;
    username : String(111);
    password : String(111);
    tasks : Composition of many Tasks on tasks.user = $self;
}

entity Tasks : managed {
    key  ID : Integer;
    user : Association to User;
    title : localized String(111);
    done : Boolean;
}

