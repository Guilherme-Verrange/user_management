class UserController{

    constructor(formId, tableId){

        this.formElement = document.getElementById(formId);
        this.tableElement = document.getElementById(tableId);
        this.onSubmit();

    }

    onSubmit(){

        this.formElement.addEventListener("submit", event => {

            event.preventDefault();

            let values = this.getValues();

            if(!values) return false;

           let btn = this.formElement.querySelector("[type=submit]")
              
            btn.disable = true; // desabilita o submit

            this.getPhoto().then
            ((content) => {
                values.photo = content;

                this.addLine(values);

                this.formElement.reset(); //Reseta formulário após enviar.

                btn.disable = false; //habilita o submit

            }, (e) => {
                console.error(e);


            });

        });

    } // class for to take submit function


    getPhoto(){

        return new Promise((resolve, eject) => {


            let fileReader = new FileReader();

        let elements = [...this.formElement.elements].filter(item => {

            if (item.name === 'photo') {
                return item;
            }

        });

        let file = elements[0].files[0];

        fileReader.onload = () => {

            resolve(fileReader.result);

        };


        fileReader.onerror = (e) =>{
            reject(e);
        };

        if (file) {
            fileReader.readAsDataURL(file);
        } else{

            resolve('/dist/img/avatar.png');
        }

        });
    }

    getValues(){

        let user = {};
        let isValid = true;

        [...this.formElement.elements].forEach(function(field, index){
            //Transforma o elemento em um array para ser entendido pelo ForEach(Spread operator).

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){ //Validação de usuário

                field.parentElement.classList.add('has-error');
                isValid = false;
               
            }

            if (field.name == "gender"){
        
                if (field.checked) {// Verificação para descobrir se gender is true;
                  user[field.name] = field.value;
                }
        
            }else if(field.name == "admin"){
                
                user[field.name] = field.checked; // Verifica o estado do checked admin.
                
            }else{
        
                user[field.name] = field.value;
              
            }
           
        }); 

        if (!isValid){

            return false;
        }
        
        return new User(user.name, user.gender, user.birth,user.country,
                 user.email, user.password, user.photo, user.admin); //  Instanciando objeto da classe User.



    } //  class that get values of form


     addLine(dataUser){
        
        let tr = document.createElement('tr');

        tr.innerHTML = `
        
            <td><img src=${dataUser.photo} alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.tableElement.appendChild(tr);
    }


};