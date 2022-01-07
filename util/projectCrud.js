//Project CRUD operations

function getProjectId(){
    return document.querySelector('input[name="project_name"]:checked').id;
  }
  
  function getSelectedProject(){
    const id = getProjectId();
  
    axios.get(`/api/projects/project/${id}`).then( res => {
      setProjectFeilds( res.data );
      });
    
  }
  
  
  function getProjectForm(action){  
    axios.get(`/api/projects/project`, { params: { action: action } }).then(
                res => {
                    //- document.write( res.data)
                    document.getElementById( 'project-mgmt-form-wrapper').
                            innerHTML = res.data;
                
                }
            )   
            
    if( action === 'Edit' ){
      getSelectedProject();
     
    }
  }
  
  function clearProjectForm() {
    const project_name = document.querySelector('#projectName').value = '';
    const project_description = document.querySelector('#projectDesc').value = ''
  }
  
  function setProjectFeilds( data  ) {
    console.log( data )
    document.getElementById('projectName').value = data.project_name;
    document.getElementById('projectDesc').value = data.project_description;
  }
  
  function getProjectFeilds() {
    const id = document.querySelector('input[name="project_name"]:checked').id;
    project_name = document.getElementById('projectName').value;
    project_description = document.getElementById('projectDesc').value;
  
    return { id, project_name , project_description };
  }
  
  
  function submitProject(action) {
    console.log("submit project" + action)
    document.getElementById("project-dashboard-subheading").innerHTML = "Your Projects";
   
  
    if( action === 'Add new'){
  
      const project_name = document.querySelector('#projectName').value;
      const project_description = document.querySelector('#projectDesc').value;
      const project = { project_name , project_description };
  
      axios.post(`/api/projects/newproject`, project)
                          .then( res => {
                            console.log( res.data)
                                        const list = document.createElement('li');    
                                        const radioBtn = setRadioButtons( res.data , "project_name" , res.data.project_name )
                                        // const radioBtn = document.createElement("INPUT");
                                        // radioBtn.setAttribute("type", "radio");
                                        // radioBtn.setAttribute("value", res.data.project_name);
                                        // radioBtn.setAttribute("name", "project_name");
                                        // radioBtn.setAttribute("id", res.data._id );
                                        radioBtn.addEventListener("change", function() {
                                            document.getElementById('edit_project_btn').disabled = false;
                                            document.getElementById('delete_project_btn').disabled = false;                              
                                          
                                        });
  
                                        const radioBtnLabel = document.createElement("LABEL");
                                        radioBtnLabel.innerHTML = res.data.project_name;
  
                                        list.appendChild(radioBtn);
                                        list.appendChild(radioBtnLabel);
                                      
                                        document.getElementById('project-list').appendChild( list ); 
                                        showProjectIssues(res.data);
                                        clearProjectForm();
                          })
                          .catch(error => console.log(error)) 
    }else{
      
      updateProject()
    }       
  }
  
  
  function updateProject(){         
    
     const project = getProjectFeilds();
     console.log( project.id);
     
     //check if the project is selected
     //if selected                
    axios.put(`/api/projects`, project ).then(
       res => {
           document.getElementById( project.id ).value = res.data.project_name
           document.getElementById( project.id ).nextElementSibling.innerHTML = res.data.project_name;
       });
  
  }
  
  
  
  
  function deleteProject(){
    const id = getProjectId();
    axios.delete(`/api/projects/${id}`).then(
                res => {
                  console.log( document.getElementById("project-list").childNodes );
                    console.log( document.getElementById("project-list").childElementCount )
                           
                      
                    
                          document.getElementById(  res.data._id ).parentNode.remove();
                          document.getElementById('edit_project_btn').disabled = true;
                          document.getElementById('delete_project_btn').disabled = true; 
                        
                        if( document.getElementById("project-list").childElementCount === 0 ){
                          document.getElementById("project-dashboard-subheading").innerHTML = "You have no projects"
                       
                        }
                    
     
                
                }
            )                     
  }