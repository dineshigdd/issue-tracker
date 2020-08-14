function deleleIssue(){   
    console.log("I am in delete")                   
    document.getElementById('btn-delete-issue').onclick = () => {
      
       axios.delete('/api/issues/' + this.id).then(
                    res => {
                      document.getElementById('issues').
                       removeChild(document.getElementById(this.id));; 
                         console.log(res.data)
                    }
               ).catch( err => console.log(err))
               
   }
}

function  updateIssue(data){
  console.log(data)
   addIssue(data,'btn-edit-issue');  
 
}

function addIssue(data,id){      

                  document.getElementById(id).onclick = () => {
                    console.log(data)   
                      axios.get('api/issues/manage/' + data._id)
                          .then(res => {   
                              
                                 document.write(res.data);            
                               //document.getElementById('project-issue').innerHTML = res.data;
                               
                              //above line makes not to trigger action in the issue page on submit btn click 
                          }).
                          then(
                              () => {
                                if( id == 'btn-edit-issue'){
                                  
                                   setUpdateFields(data)
                                }else{
                                  document.getElementById('issue-form-wrapper').setAttribute("name",'new-issue');
                                }
                              }

                             
                          )
                          .catch( err => console.log( err ))
                  }
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
  console.log(action)
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
  let id =  localStorage.getItem('id');
  console.log("this is before calling")        

  if( action == 'new-issue'){
          axios.post('/api/issues/' + id , Issue ,{
                  headers: {
                      'Authorization': localStorage.getItem('jwtToken')
                  }
                  }
                  
                  ).then(
              res => {
                  console.log( res.data )
                  //- localStorage.setItem('newIssue',res.data.issue_title);
                  //- list.appendChild(btn);    
                  const newIssueItem = document.createElement('li');
                  newIssueItem.id = res.data._id;
                  const newIssue = document.createTextNode(res.data.issue_title);  
                  newIssueItem.appendChild(newIssue);
                  document.getElementById('issues').appendChild(newIssueItem); 
                  document.getElementById( newIssueItem.id ).addEventListener('click',
                                                  deleleIssue); 
                  //- document.write(res.data)
                  
              }
          ).catch(
              err => console.log(err)
          )
  }

  if( action == 'edit-issue'){
        axios.put('/api/issues/'+ id,Issue, { headers: {
                      'Authorization': localStorage.getItem('jwtToken')
                  }
                  })
              .then( 
                  res =>{
                      document.getElementById( res.data._id ).innerHTML = res.data.issue_title;
                  })
              .catch( err => console.log( err  ))
       
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