class UserController{

    constructor(formId, tableId){

        this.formElement = document.getElementById(formId);
        this.tableElement = document.getElementById(tableId);
        this.onSubmit();

    }

    onSubmit(){

       this.formElement.addEventListener("submit", (e) => {

            e.preventDefault();

            this.addLine(this.getValues())
         
         });

    } // class for to take submit function


    getValues(){

        let user = {};

        [...this.formElement.elements].forEach(function(field, index){

            if (field.name == "gender"){
        
                if (field.checked) {// Verificação para descobrir se gender is true;
                  user[field.name] = field.value;
                }
        
            }else{
        
                user[field.name] = field.value;
              
            }
           
        }); 
        
        return new User(user.name, user.gender, user.birth,user.country,
                 user.email, user.password, user.photo, user.admin); //  Instanciando objeto da classe User.



    } //  class that get values of form


     addLine(dataUser){
    
        this.tableElement.innerHTML = `
        
        <tr>
            <td>
            <img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm">
            </td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin}</td>
                <td>${dataUser.birth}</td>
                <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
         </tr>
        
        `;
    }


};