import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { toast } from "../Components/Toast";

const A = {bg:"#F8F9FC",surface:"#FFFFFF",border:"#E4E9F2",text:"#111827",muted:"#6B7280",indigo:"#4F46E5",indigoBg:"#EEF2FF",indigoBorder:"#C7D2FE",danger:"#EF4444",success:"#10B981",font:"'Inter','Segoe UI',system-ui,sans-serif"};

const mkInput=(focused,name,err)=>({width:"100%",boxSizing:"border-box",padding:"0.72rem 0.9rem",background:A.bg,border:`1.5px solid ${err?A.danger:focused===name?A.indigo:A.border}`,borderRadius:"10px",color:A.text,fontSize:"0.9rem",outline:"none",fontFamily:A.font,transition:"border-color 0.2s"});

function AddUser() {
  const navigate=useNavigate();
  const [user,setUser]=useState({name:"",email:"",password:""});
  const [errors,setErrors]=useState({});
  const [focused,setFocused]=useState(null);
  const [loading,setLoading]=useState(false);

  const change=(e)=>{ const{name,value}=e.target; setUser({...user,[name]:value}); let err=""; if(name==="email"&&!/\S+@\S+\.\S+/.test(value))err="Invalid email"; if(name==="password"&&value.length<6)err="Min. 6 chars"; setErrors({...errors,[name]:err}); };
  const validate=()=>{ const e={}; if(!user.name.trim())e.name="Required"; if(!user.email)e.email="Required"; else if(!/\S+@\S+\.\S+/.test(user.email))e.email="Invalid email"; if(!user.password)e.password="Required"; else if(user.password.length<6)e.password="Min. 6 chars"; setErrors(e); return Object.keys(e).length===0; };
  const submit=async(e)=>{ e.preventDefault(); if(!validate())return; setLoading(true); try{ await axios.post("https://aaryaautogarage.onrender.com/users",user); navigate("/users"); }catch{toast.error("Failed to create user.");} finally{setLoading(false);} };

  return (
    <Sidebar>
      <div style={{maxWidth:"500px",margin:"0 auto"}}>
        <div style={{background:A.surface,border:`1.5px solid ${A.border}`,borderRadius:"20px",overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
          <div style={{background:A.bg,padding:"1.5rem 2rem",borderBottom:`1px solid ${A.border}`}}>
            <h2 style={{color:A.text,fontSize:"1.15rem",fontWeight:800,margin:0}}>Add Customer</h2>
            <p style={{color:A.muted,fontSize:"0.85rem",margin:"0.3rem 0 0"}}>Create a new customer account</p>
          </div>
          <div style={{padding:"2rem"}}>
            <form onSubmit={submit}>
              {[{label:"Full Name",name:"name",type:"text",ph:"Customer full name"},{label:"Email Address",name:"email",type:"email",ph:"customer@example.com"},{label:"Password",name:"password",type:"password",ph:"Min. 6 characters"}].map(f=>(
                <div key={f.name} style={{marginBottom:"1.15rem"}}>
                  <label style={{display:"block",color:A.muted,fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:"0.5rem"}}>{f.label}</label>
                  <input type={f.type} name={f.name} placeholder={f.ph} value={user[f.name]} onChange={change}
                    onFocus={()=>setFocused(f.name)} onBlur={()=>setFocused(null)}
                    style={mkInput(focused,f.name,errors[f.name])}/>
                  {errors[f.name]&&<p style={{color:A.danger,fontSize:"0.75rem",margin:"0.3rem 0 0"}}>{errors[f.name]}</p>}
                </div>
              ))}
              <button type="submit" disabled={loading} style={{width:"100%",padding:"0.88rem",background:"linear-gradient(135deg,#4F46E5,#6366F1)",border:"none",borderRadius:"10px",color:"#fff",fontWeight:700,fontSize:"0.95rem",cursor:loading?"not-allowed":"pointer",fontFamily:A.font,opacity:loading?0.7:1,boxShadow:"0 4px 16px rgba(79,70,229,0.3)",marginTop:"0.5rem"}}>
                {loading?"Saving...":"Save Customer →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
export default AddUser;