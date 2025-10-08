// =============================================
// DÉCLARATION DES VARIABLES
// =============================================
const form = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const descInput = document.getElementById("description");
const taskList = document.getElementById("taskList");

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



// =============================================
// FONCTIONS UTILITAIRES
// =============================================

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
        
        toggleBtn.addEventListener("click", function() {
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

        // bouton modifier
        let editBtn = document.createElement("button");

        // bouton supprimer
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "task-action-btn delete";
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = "Supprimer la tâche";
        deleteBtn.addEventListener("click", function() {
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
        actions.append(toggleBtn, deleteBtn);
        //remplir header-task
        header.append(titleSpan, actions);

        //description de la tâche (à faire)

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

        switch(task.category) {
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
        li.append(header,footer);

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

    //ajout de la tache dans tasks
    tasks.push({
        title,
        category,
        description,
        date: new Date().toISOString(),
        done: false
    });

    //remettre à zéro le formulaire
    titleInput.value = "";
    categoryInput.value = "perso";
    descInput.value = "";

    //sauvegarder mes tasks dans localstorage
    saveTasks();
    //modification de l'affichage
    renderTasks();
});  

//génération du rendu au chargement de la page
renderTasks();