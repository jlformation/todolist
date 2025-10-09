// =============================================
// DÉCLARATION DES VARIABLES
// =============================================
const form = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const descInput = document.getElementById("description");
const taskList = document.getElementById("taskList");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

const h1 = document.querySelector("h1");

let editingIndex = null;

const pager = document.querySelector(".pager");
const nbPage = 2;



//tableau qui contiendra toutes les tâches de l'utilisateur et servira de référence
//on regarde d'abord si on a des tasks dans localstorage
// init du tableau des tâches
//let tasks = [];
// si tasks est bien présent dans localstorage
//JSON.parse prend une représentation d'un tableau au format json et le converti en tableau js
// if (localStorage.getItem("tasks")) {
//     tasks = JSON.parse(localStorage.getItem("tasks"));
// }
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let totalTasks = 0;



// =============================================
// FONCTIONS UTILITAIRES
// =============================================

/**
 * Met à jour le pager
 */
function updatePager() {
    const nb = Math.ceil(totalTasks / nbPage);

    for(let i = 1; i <= nb; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className= "btn btn-primary";
        button.addEventListener("click", function() {
            //à compléter
        });
        pager.appendChild(button);
    }
}

/**
 * Met à jour le compteur de tâches terminées
 */
function updateTaskCount() {
    //compter uniquement les taches qui ont done = true
    const completedTasks = tasks.filter(task => task.done).length;
    totalTasks = tasks.length;

    //variable de travail
    //par default on a aucune tâche
    let content = "Mes Tâches";
    if (totalTasks > 0) {
        content += ` ${completedTasks}/${totalTasks}`;
    }

    //écrire dans h1
    h1.textContent = content;

    //en ternaire
    //h1.textContent = `Mes Tâches ${totalTasks > 0 ? `(${completedTasks}/${totalTasks})` : ''}`;


}

/**
 * Sauvegarde les tâches dans localStorage
 */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Affiche les tâches dans le DOM
 */
function renderTasks() {
    //mise à jour du compteur
    updateTaskCount();
    //mise à jour du pager
    updatePager();
    //effacer toutes les tâches dans notre ul et recomposer l'affichage
    taskList.innerHTML = "";

    //tester si on n'a aucune tâche
    if (tasks.length === 0) {
        //<li class="empty-message">Aucune tâche pour le moment. Ajoutez-en une avec le formulaire ci-dessus.</li>
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "Aucune tâche pour le moment. Ajoutez-en une avec le formulaire ci-dessus.";
        taskList.appendChild(emptyMessage);

        return;
    }

    //ici on a au moins une tâche
    //parcourir tasks
    tasks.forEach(function (task, index) {
        //pour chaque task on va créer notre li dans le DOM
        let li = document.createElement("li");
        li.className = `task-item ${task.done ? 'done' : ''}`;
        /*
        if (task.done === true) {
        li.className = "task-item done";
        }
        else {
        li.className = "task-item";
        }
        */
        li.dataset.category = task.category;

        let header = document.createElement("div");
        header.className = "task-header";

        let titleSpan = document.createElement("span");
        titleSpan.className = "task-title";
        titleSpan.textContent = task.title;

        let actions = document.createElement("div");
        actions.className = "task-actions";

        // bouton terminée
        let toggleBtn = document.createElement("button");
        toggleBtn.className = `task-action-btn ${task.done ? 'done' : ''}`;
        // if (task.done === true) {
        // toggleBtn.className = "task-action-btn done";
        // }
        // else {
        // toggleBtn.className = "task-action-btn";
        // }
        toggleBtn.innerHTML = task.done ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>';
        toggleBtn.title = task.done ? "Marquer comme non terminée" : "Marquer comme terminée";

        toggleBtn.addEventListener("click", function () {
            //si done est sur true on le passe sur false et inversement
            tasks[index].done = !tasks[index].done;

            //sauvegarder mes tasks dans localstorage
            saveTasks();
            //mise à jour de l'affichage
            renderTasks();
        });

        // bouton détails
        let detailBtn = document.createElement("button");
        detailBtn.className = "task-action-btn";
        detailBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        detailBtn.title = "Afficher/masquer les détails";
        detailBtn.addEventListener("click", function () {
            descDiv.classList.toggle("visible");
            /* si detailBtn contient la class visible -> chevron vers le haut 
            sinon -> chevron vers le bas*/
            if (descDiv.classList.contains("visible")) {
                //description est déployé
                this.innerHTML = '<i class="fas fa-chevron-up"></i>';
            }
            else {
                this.innerHTML = '<i class="fas fa-chevron-down"></i>';
            }
            //this.innerHTML = descDiv.classList.contains("visible") ? '<i class="fas fa-chevron-up"></i>' : '<i class="fas fa-chevron-down"></i>';
        });

        // bouton modifier
        let editBtn = document.createElement("button");
        editBtn.className = "task-action-btn";
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = "Modifier la tâche";
        editBtn.addEventListener("click", function () {
            //renseigner les values du formulaire avec nos values de la tâche
            titleInput.value = task.title;
            categoryInput.value = task.category;
            descInput.value = task.description || "";
            //modifier des élèments du formulaire (on n'est plus sur une création mais sur une édition)
            submitBtn.textContent = "Mettre à jour";
            cancelBtn.style.display = "block";
            //donner l'index à editingIndex
            editingIndex = index;
            //scroller pour avoir le formulaire dans le viewport
            form.scrollIntoView({ behavior: "smooth" });
        });

        // bouton supprimer
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "task-action-btn delete";
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = "Supprimer la tâche";
        deleteBtn.addEventListener("click", function () {
            if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
                //on rentre dans la condition uniquement si l'utilisateur a cliqué sur ok
                //suppression de la tâche
                tasks.splice(index, 1);

                //sauvegarder mes tasks dans localstorage
                saveTasks();
                //rafraichi le rendu
                renderTasks();
            }
        });

        //remplir actions
        //actions.append(toggleBtn, detailBtn, editBtn, deleteBtn);
        actions.append(toggleBtn, detailBtn, editBtn, deleteBtn);
        //remplir header-task
        header.append(titleSpan, actions);

        //description de la tâche (à faire)
        let descDiv = document.createElement("div");
        descDiv.className = "task-description";
        descDiv.textContent = task.description || "Aucune description";
        /*
        if (!task.description) {
        descDiv.textContent = "Aucune description";
        }
        else {
            descDiv.textContent = task.description;
            }
        */

        //construire le task-footer
        let footer = document.createElement("div");
        footer.className = "task-footer";

        //date
        let dateInfo = document.createElement("div");
        dateInfo.className = "task-date";
        dateInfo.textContent = new Date(task.date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        //badge category
        let categoryBadge = document.createElement("span");

        switch (task.category) {
            case "perso":
                categoryBadge.className = "category-badge perso";
                categoryBadge.textContent = "🏠 Perso";
                break;

            case "pro":
                categoryBadge.className = "category-badge pro";
                categoryBadge.textContent = "💼 Pro";
                break;

            case "autre":
                categoryBadge.className = "category-badge autre";
                categoryBadge.textContent = "📌 Autre";
                break;

        }

        //construire le footer
        footer.append(dateInfo, categoryBadge);



        //remplir notre li
        li.append(header, descDiv, footer);

        //on insére le li dans notre taskList
        taskList.appendChild(li);

    });
}

// =============================================
// code principal : GESTION DU FORMULAIRE
// =============================================  
//point de départ c'est la validation du formulaire
form.addEventListener("submit", function (e) {
    //stopper le comportement par default
    e.preventDefault();

    //récupérer les valeurs des champs
    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const description = descInput.value.trim();

    //tester le titre
    if (!title) {
        alert('Le titre est obligatoire !');
        return;
    }

    //si on est sur de l'edition ou de la création (à faire)
    if (editingIndex !== null) {
        tasks[editingIndex] = {
            title,
            category,
            description,
            date: new Date().toISOString(),
            done: false
        };

        submitBtn.textContent = "Ajouter";
        cancelBtn.style.display = "none";
        editingIndex = null;

    }
    else {
        //ajout de la tache dans tasks
        tasks.push({
            title,
            category,
            description,
            date: new Date().toISOString(),
            done: false
        });
    }


    //remettre à zéro le formulaire
    titleInput.value = "";
    categoryInput.value = "perso";
    descInput.value = "";



    //sauvegarder mes tasks dans localstorage
    saveTasks();
    //modification de l'affichage
    renderTasks();
});

// Annuler l'édition
cancelBtn.addEventListener("click", function () {
    titleInput.value = "";
    categoryInput.value = "perso";
    descInput.value = "";
    submitBtn.textContent = "Ajouter";
    cancelBtn.style.display = "none";
    editingIndex = null;
});

//génération du rendu au chargement de la page
renderTasks();