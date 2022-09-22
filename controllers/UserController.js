class UserController{

    constructor(formIdCreate, formIdUpdate, tableId){

        this.formElement = document.getElementById(formIdCreate);
        this.formUpdateElement = document.getElementById(formIdUpdate);
        this.tableElement = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit();

    }

    
    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {

            this.showPanelCreate();

        });

        this.formUpdateElement.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formUpdateElement.querySelector("[type=submit]")

            btn.disabled = true;

            let values = this.getValues(this.formUpdateElement);

            let index = this.formUpdateElement.dataset.trIndex;

            let tr = this.tableElement.rows[index];

            tr.dataset.user = JSON.stringify(values);

            tr.innerHTML = `
                <tr>
                    <td><img src=${values.photo} class="img-circle img-sm"></td>
                    <td>${values.name}</td>
                    <td>${values.email}</td>
                    <td>${(values.admin) ? 'Sim' : 'Não'}</td>
                    <td>${Utils.dateFormat(values.register)}</td>
                    <td>
                        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>
                </tr>
            `;

            this.addEventsTr(tr);

            this.updateCount();

        });

    }



    onSubmit(){

        this.formElement.addEventListener("submit", event => {

            event.preventDefault();

           let btn = this.formElement.querySelector("[type=submit]")
              
            btn.disable = true; // desabilita o submit

            let values = this.getValues(this.formElement);

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

    getValues(formElement){

        let user = {};
        let isValid = true;

        [...formElement.elements].forEach(function(field, index){
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

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
        
            <td><img src=${dataUser.photo} alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        this.tableElement.appendChild(tr);

        this.updateCount();
    }


    addEventsTr(tr) {

        tr.querySelector(".btn-edit").addEventListener("click", e => {

            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");

            form.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json) {

                let field = form.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {

                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                            
                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                        break;

                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name];

                    }

                    field.value = json[name];
                }


            }
            
            this.showPanelUpdate();

        });

    }

    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }

    updateCount() { //Atualiza o numero de usuários do sistema

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableElement.children].forEach(tr => {

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmin++;
        })

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;

    }
};