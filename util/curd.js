var ID = '';
 
function getIssueId(){
  return document.querySelector('input[name="project_issue"]:checked').id;
}

function showProjectIssues(data){ 
  document.getElementById(data._id).onclick = () => {
      let getUrl = window.location;
      let URL = getUrl.origin + '/api/issues/' + data._id;  
  
  
      //-  window.location.href = (URL)
      AjaxRequest('/api/issues/' + data._id, data._id);                            
      
  }                           
      
} 

function deleleIssue(){   
    console.log("I am in delete")        
    const id = getIssueId();
    axios.delete(`/api/issues/${ id }`).then(
                        res => {
                          document.getElementById( id ).parentNode.remove();
                             console.log(res.data)
                        }
                   ).catch( err => console.log(err));

  
}

function  updateIssue(){

  const project_id = getProjectId();
  const data = JSON.parse(localStorage.getItem('project-issue-form'));
  console.log( data);
  // const issue_id = getIssueId();
  const issue_id = getIssueId();
  
  data.forEach( issue => {
    if(issue_id === issue._id){
      addIssue(issue, project_id ,'btn-edit-issue');  
    } 
  });
   
 
}

function addIssue(data, project_id, id){      
                
                  // document.getElementById(id).onclick = () => {
                    // console.log(data[0].project)   
                    // let getUrl = window.location;
                    // let URL = getUrl.origin +  '/api/issues/manage/'  + data[0].project 
                           
                    
                      axios.get('/api/issues/manage/' + project_id)                  
                          .then(res => {   
                                // console.log(res.data) 
                              //  document.write(res.data);            
                                document.getElementById('project-issue-form').innerHTML = res.data;
                                ID = project_id;
                              // above line makes not to trigger action in the issue page on submit btn click 
                          }).
                          then(
                              () => {
                                if( id === 'btn-edit-issue'){
                                    
                                   setUpdateFields(data)
                                }else{
                                  document.getElementById('issue-form-wrapper').setAttribute("name",'new-issue');
                                }
                              }

                             
                          )
                         .catch( err => console.log( err ))
                  // }
} 


function setUpdateFields(data){
  
  //  document.getElementById('issue_title').value ='';
   document.getElementById('issue_title').value = data.issue_title;
   document.getElementById('issue_text').value = data.issue_text;
   document.getElementById('assigned_to').value = data.assigned_to;
   document.getElementById('status_select').value = data.status_text;
   document.getElementById('open').checked = data.open;
   document.getElementById('issue-form-wrapper').setAttribute("name",'edit-issue');   
  
}



function sendissue(){
  
  let action = document.getElementById('issue-form-wrapper').getAttribute("name");

  console.log("sending an issue") 
  let issue_title = document.getElementById('issue_title').value;
  let issue_text = document.getElementById('issue_text').value;
  let assigned_to = document.getElementById('assigned_to').value;
  let status_text = document.getElementById('status_select').value;
  let open = getOpen();

  const Issue = {
      issue_title,
      issue_text,
      assigned_to,
      status_text,
      open
  };
  
  
  console.log("Value of open:" + Issue.open)
  let id = ID;
  console.log("id in addIssue"+ id)
  console.log("this is before calling")        
 
  if( action == 'new-issue'){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                  const data = JSON.parse( this.responseText );
                  
                  const newIssueItem = document.createElement('li');

                  const radioBtn = setRadioButtons( data, "project_issue", data.issue_title );
                  newIssueItem.appendChild(radioBtn);

                  // newIssueItem.id = data._id;
                  const newIssue = document.createTextNode(data.issue_title);  
                  newIssueItem.appendChild(newIssue);
                  document.getElementById('issues').appendChild(newIssueItem); 
                  
                  let oldIssues = JSON.parse(localStorage.getItem('project-issue-form')) || [];

                  oldIssues.push(data);

                  localStorage.setItem('project-issue-form', JSON.stringify(oldIssues));
                  
                  // document.getElementById( newIssueItem.id ).addEventListener('click', deleleIssue); 
                  
            
            }
        };
        xhttp.open("POST", '/api/issues', true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({ id: id , issue: Issue }));
        
  //       axios.post('/api/issues/' + id , Issue ,{
  //                 headers: {
  //                     'Authorization': localStorage.getItem('jwtToken')
  //                 }
  //                 }
                  
  //                 ).then(
  //             res => {
  //                 console.log( res.data )
  //                 //- localStorage.setItem('newIssue',res.data.issue_title);
  //                 //- list.appendChild(btn);    
  //                 const newIssueItem = document.createElement('li');
  //                 newIssueItem.id = res.data._id;
  //                 const newIssue = document.createTextNode(res.data.issue_title);  
  //                 newIssueItem.appendChild(newIssue);
  //                 document.getElementById('issues').appendChild(newIssueItem); 
  //                 document.getElementById( newIssueItem.id ).addEventListener('click',
  //                                                 deleleIssue); 
  //                 //- document.write(res.data)
                  
  //             }
  //         ).catch(
  //             err => console.log(err)
  //         )
  }

  if( action == 'edit-issue'){
   
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                  const data = JSON.parse( this.responseText );                 
                  document.getElementById( data._id ).innerHTML = data.issue_title;                     
            
            }
        };
        Issue.id = id;
        console.log(Issue)
        xhttp.open("PUT", '/api/issues', true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({issue: Issue }));
        
        // axios.put('/api/issues/'+ id,Issue, { headers: {
        //               'Authorization': localStorage.getItem('jwtToken')
        //           }
        //           })
        //       .then( 
        //           res =>{
        //               document.getElementById( res.data._id ).innerHTML = res.data.issue_title;
        //           })
        //       .catch( err => console.log( err  ))
       
        }
}

function clearForm(){
  document.getElementById('issue_title').value = '';
  document.getElementById('issue_text').value = '';
  document.getElementById('assigned_to').value = '';  
  document.getElementById('status_select').value = 'active';
  document.getElementById('open').checked = true;
}

function getOpen(){
  if( document.getElementById('open').checked ){
      return true;
  }
  return false;

}

function AjaxRequest(url, project_id ) {
  
  var xhttp = new XMLHttpRequest();
 
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      
        // console.log(JSON.parse(this.responseText)[0].issue_title)
        localStorage.setItem('project-issue-form',this.responseText)
        setIssueData(this.responseText, project_id)
               
     
        
      }
  };
  xhttp.open("GET", url, true);
  xhttp.send();

}

function setIssueData(responseText, project_id ){ 
  
  document.getElementById('issue-heading').innerHTML =
     `The issues of the project:${  document.getElementById(project_id).innerText }`
  document.getElementById('issues').innerHTML ='';
      // var arr = []
      var data = JSON.parse(responseText);
      data.forEach(element => {
        // arr.push({ id: element._id, issue_title: element.issue_title})
        let list = '';
        list = document.createElement('li');  
        const radioBtn = setRadioButtons( element,"project_issue", element.issue_title );
        list.appendChild(radioBtn);

        // list.id = element._id;                                                                                                                 
        let issue_title = document.createTextNode( element.issue_title );
        list.appendChild(issue_title);
        document.getElementById('issues').appendChild( list ); 
        // document.getElementById(  radioBtn.id ).addEventListener('click',deleleIssue);
        // document.getElementById(radioBtn.id).addEventListener('click',() => updateIssue(element,element._id));
      });
      issueManagementButtons(data,project_id);
}

// function isRefresh(){
//     try{
//       setIssueData( localStorage.getItem('project-issue-form'))
//     }catch(err){
//       console.log(err)
//     }
  
// }


 function issueManagementButtons(data,project_id){
            document.getElementById('issue-btn-wrapper').innerHTML =''
            let addBtn = document.createElement("BUTTON");
            addBtn.id = "btn-create-issue";            
            addBtn.innerHTML = "New issue";                                                                         
            document.getElementById('issue-btn-wrapper').appendChild( addBtn );  

        //    window.location.href = window.location.origin + '/api/issues/manage/' + data[0].project;
            // document.getElementById('btn-create-issue').
            //   addEventListener('click', AjaxRequest(window.location.origin + '/api/issues/manage/' + data[0].project));
            document.getElementById('btn-create-issue').addEventListener('click',()=> addIssue(data,project_id,addBtn.id));
        
            let editBtn = document.createElement("BUTTON");
            editBtn.id = 'btn-edit-issue';
            editBtn.innerHTML = "Edit issue";                                                                         
            document.getElementById('issue-btn-wrapper').appendChild( editBtn);                     
            editBtn.addEventListener( 'click', ()=>updateIssue() );

            let deleteBtn = document.createElement("BUTTON");
            deleteBtn.id = 'btn-delete-issue';
            deleteBtn.innerHTML = "Delete issue";                                                                         
            document.getElementById('issue-btn-wrapper').appendChild( deleteBtn );
            deleteBtn.addEventListener( 'click', ()=>deleleIssue );
            
           
}