function radionButtonBehavior(){
    if (document.querySelector('input[name="project_name"]')) {
            document.querySelectorAll('input[name="project_name"]').forEach((elem) => {
                elem.addEventListener("change", function(event) {
                console.log( elem.checked);
                document.getElementById('edit_project_btn').disabled = false;
                document.getElementById('delete_project_btn').disabled = false;
                let projectId = event.target.id;
                                             
                document.getElementById('delete_project_btn').addEventListener('click', ()=>deleteProject(projectId) );
              //  document.getElementById('edit_project_btn').addEventListener('click', ()=>getSelectedProject(projectId) )
                               

                });
            });
            }
    }