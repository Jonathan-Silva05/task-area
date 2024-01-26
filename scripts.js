  // Função chamada quando um elemento é arrastado sobre a área de soltar
  function allowDrop(event) {
    event.preventDefault();
  }

  // Função chamada quando um elemento é iniciado o arraste
  function drag(event) {
    var draggedElement = event.target;

    // Adiciona estilo de opacidade ao elemento sendo arrastado apenas durante o arraste
    draggedElement.style.opacity = '0.5';

    event.dataTransfer.setData("text", draggedElement.id);

    // Remove estilo de opacidade ao soltar o elemento
    event.target.addEventListener('dragend', function() {
      draggedElement.style.opacity = '1';
    });
  }

  // Função chamada quando um elemento é solto na área de soltar
  function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    var dropTarget = event.target;

    // Move a tarefa para o novo local
    if (dropTarget.classList.contains('task-list')) {
      dropTarget.appendChild(draggedElement);
    } else if (dropTarget.classList.contains('task')) {
      dropTarget.parentNode.insertBefore(draggedElement, dropTarget.nextSibling);
    }
  }

  // Abre a criação de uma nova tarefa
  function openNewTask() {
    var open = document.querySelector("#create-task");
    // Adicionar a classe apropriada
    open.classList.add('open-create-task');
  }

  // Fecha a criação de uma nova tarefa
  function closeNewTask() {
    var close = document.querySelector("#create-task");
    // Adicionar a classe apropriada
    close.classList.remove('open-create-task');

    // Limpa o texto do input
    var taskInput = document.querySelector("#name_task");
    taskInput.value = "";

    // Limpa o texto da textarea
    var taskDescribe = document.querySelector("#describeTask");
    taskDescribe.value = "";

    // Encontra o input de opção de cor marcado
    var selectedColorInput = document.querySelector("input[name='colorTask']:checked");
    // Limpa a seleção de cor
    selectedColorInput.checked = false;

    // Remove a classe 'active' de todos os rótulos
    var colorLabels = document.querySelectorAll('.colors label');
    colorLabels.forEach(function (label) {
      label.classList.remove('active');
    });

    checkTaskInput();
  }

  // Inicializa um contador para os IDs das tarefas
  var taskIdCounter = 1;

  // Objeto para armazenar descrições de tarefas
  var taskDescriptions = {};

  function createNewTask() {
    var task = document.querySelector("#name_task");
    var taskDescribe = document.querySelector("#describeTask");
    var selectedColorInput = document.querySelector("input[name='colorTask']:checked");

    if (!selectedColorInput) {
      return;
    }

    var taskColor = selectedColorInput.value;
    const newTaskList = document.getElementById('task-list');

    var taskId = "task_" + taskIdCounter;

    // Adiciona a nova tarefa com o ID único, a cor escolhida e a descrição
    newTaskList.innerHTML += `<div id="${taskId}" class="task" draggable="true" ondblclick="visibilityTask('${taskId}')" ondragstart="drag(event)" style="background-color: #${taskColor};">${task.value}</div>`;

    // Armazena a descrição da tarefa no objeto taskDescriptions
    taskDescriptions[taskId] = taskDescribe.value;

    taskIdCounter++;
    closeNewTask();
  }

  // Função para verificar a entrada e atualizar o botão
  function checkTaskInput() {
    var taskInput = document.querySelector("#name_task");
    var taskDescribe = document.querySelector("#describeTask");
    var selectedColorInput = document.querySelector("input[name='colorTask']:checked");
    var saveButton = document.querySelector("#save");

    // Verifica se ambos os campos de entrada têm conteúdo
    if (taskInput.value.trim() === "" || taskDescribe.value.trim() === "" || !selectedColorInput || selectedColorInput.value.trim() === "") {
      saveButton.disabled = true; // Desabilita o botão
    } else {
      saveButton.disabled = false; // Habilita o botão
    }
  }

  function visibilityTask(id) {
    var contentDiv = document.querySelector('#contentTask');
    var taskContent = document.getElementById(id).textContent; // Obter o conteúdo da tarefa
    var taskDescription = taskDescriptions[id]; // Obter a descrição da tarefa

    contentDiv.innerHTML = `
    <div id="view_${id}" class="visibilityTask">
      <div class="divBtnClose">
        <button class="btnClose btnCloseTask"> X </button>
      </div>

      <div class="titleTask"> 
        <p> ${taskContent} </p> 
        <div class="btnsEdt">
          <button onclick="deleteTask('${id}')">Excluir</button>
          <button onclick="editTask('${id}')">Editar</button>
        </div>
      </div>
      <p> ${taskDescription} </p>
    </div>`;

    contentDiv.style.visibility = 'visible';

    var btn = document.querySelector('.btnCloseTask');
    btn.addEventListener('click', function() {
      contentDiv.innerHTML = ` `;
      contentDiv.style.visibility = 'hidden';
    });
  }

  function editTask(id) {
    var taskElement = document.getElementById(id);
    var taskName = taskElement.textContent;
    var taskDescription = taskDescriptions[id];

    // Transforma o conteúdo da tarefa em um input para edição
    taskElement = `<p><input type='text' id='editTaskName_${id}' value='${taskName}' maxlength="50"/> </p>`;

    // Mostra o formulário de edição para a descrição
    var contentDiv = document.querySelector('#contentTask');
    contentDiv.innerHTML = `
    <div id="view_${id}" class="visibilityTask">
      <div class="titleTask"> `+
        taskElement + `
      </div>
      <p> <textarea id='editTaskDescription_${id}' rows='10'>${taskDescription}</textarea> </p>
      <div class="btnsEdt">
        <button id="saveEdit" onclick="saveEdit('${id}')"> Salvar </button>
        <button id="cancelEdit" onclick="cancelEdit('${id}', '${taskName}', '${taskDescription}')"> Cancelar </button>
      </div>
    </div>`;
  }

  function saveEdit(id) {
    var editedTaskName = document.getElementById(`editTaskName_${id}`).value;
    var editedTaskDescription = document.getElementById(`editTaskDescription_${id}`).value;

    var taskElement = document.getElementById(id);
    taskElement.textContent = editedTaskName;
    taskDescriptions[id] = editedTaskDescription;
    var contentDiv = document.querySelector('#contentTask');
    var taskContent = document.getElementById(id).textContent; // Obter o conteúdo da tarefa
    var taskDescription = taskDescriptions[id]; // Obter a descrição da tarefa

    contentDiv.innerHTML = `
    <div id="view_${id}" class="visibilityTask">
      <div class="divBtnClose">
        <button class="btnClose btnCloseTask"> X </button>
      </div>

      <div class="titleTask"> 
        <p> ${taskContent} </p> 
        <div class="btnsEdt">
          <button onclick="deleteTask('${id}')">Excluir</button>
          <button onclick="editTask('${id}')">Editar</button>
        </div>
      </div>
      <p> ${taskDescription} </p>
    </div>`;

    contentDiv.style.visibility = 'visible';

    var btn = document.querySelector('.btnCloseTask');
    btn.addEventListener('click', function() {
      contentDiv.innerHTML = ` `;
      contentDiv.style.visibility = 'hidden';
    });
  }

  function cancelEdit(id, originalName, originalDescription) {
    var contentDiv = document.querySelector('#contentTask');
    var taskContent = document.getElementById(id).textContent; // Obter o conteúdo da tarefa
    var taskDescription = taskDescriptions[id]; // Obter a descrição da tarefa

    contentDiv.innerHTML = `
    <div id="view_${id}" class="visibilityTask">
      <div class="divBtnClose">
        <button class="btnClose btnCloseTask"> X </button>
      </div>

      <div class="titleTask"> 
        <p> ${taskContent} </p> 
        <div class="btnsEdt">
          <button onclick="deleteTask('${id}')">Excluir</button>
          <button onclick="editTask('${id}')">Editar</button>
        </div>
      </div>
      <p> ${taskDescription} </p>
    </div>`;

    contentDiv.style.visibility = 'visible';

    var btn = document.querySelector('.btnCloseTask');
    btn.addEventListener('click', function() {
      contentDiv.innerHTML = ` `;
      contentDiv.style.visibility = 'hidden';
    });
  }


  function deleteTask(id) {
    var taskElement = document.getElementById(id);
    if (taskElement) {
        taskElement.remove();
        delete taskDescriptions[id];
    }

    // Fecha a área de edição da descrição
    var contentDiv = document.querySelector('#contentTask');
    contentDiv.innerHTML = '';
    contentDiv.style.visibility = 'hidden';
  }

  // Função chamada quando o DOM é completamente carregado
  document.addEventListener('DOMContentLoaded', function () {
    var colorLabels = document.querySelectorAll('.colors label');

    colorLabels.forEach(function (label) {
      label.addEventListener('click', function () {
        // Remove a classe 'active' de todos os rótulos da cor da tarefa
        colorLabels.forEach(function (label) {
          label.classList.remove('active');
        });

        // Adiciona a classe 'active' ao rótulo clicado
        label.classList.add('active');
      });
    });
  });
