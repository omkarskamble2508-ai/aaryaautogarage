import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { toast } from "../Components/Toast";

const A = {bg:"#F8F9FC",surface:"#FFFFFF",border:"#E4E9F2",text:"#111827",muted:"#6B7280",indigo:"#4F46E5",indigoBg:"#EEF2FF",indigoBorder:"#C7D2FE",danger:"#EF4444",success:"#10B981",font:"'Inter','Segoe UI',system-ui,sans-serif"};
const mkInput=(focused,name,err)=>({width:"100%",boxSizing:"border-box",padding:"0.72rem 0.9rem",background:A.bg,border:`1.5px solid ${err?A.danger:focused===name?A.indigo:A.border}`,borderRadius:"10px",color:A.text,fontSize:"0.9rem",outline:"none",fontFamily:A.font,transition:"border-color 0.2s"});

function Editproduct() {
  const {pid}=useParams();
  const navigate=useNavigate();
  const [product,setProduct]=useState({part_name:"",brand:"",applicability_base_model:"",applicable_model:"",categories:"",price:"",stock_quantity:"",image:""});
  const [image,setImage]=useState(null);
  const [errors,setErrors]=useState({});
  const [focused,setFocused]=useState(null);
  const [loading,setLoading]=useState(false);
  const [uploading,setUploading]=useState(false);

  useEffect(()=>{
    axios.get(`https://aaryaautogarage.onrender.com/Product/${pid}`).then(r=>{
      const d=r.data;
      setProduct({part_name:d.pname??d.part_name??"",brand:d.pdisc??d.brand??"",applicability_base_model:d.applicability_base_model??"",applicable_model:d.applicable_model??"",categories:d.categories??"",price:d.pmrp??d.price??"",stock_quantity:d.stock_quantity??0,image:d.pimage??d.image??""});
    }).catch(()=>toast.error("Failed to load product"));
  },[pid]);

  const change=(e)=>{ const{name,value}=e.target; setProduct({...product,[name]:value}); let err=""; if(name==="price"&&Number(value)<0)err="Invalid"; setErrors({...errors,[name]:err}); };
  const validate=()=>{ const e={}; if(!product.part_name?.trim())e.part_name="Required"; if(!product.price)e.price="Required"; else if(Number(product.price)<0)e.price="Invalid"; setErrors(e); return Object.keys(e).length===0; };
  const upload=async()=>{ if(!image)return toast.warning("Select an image first"); const f=new FormData(); f.append("image",image); setUploading(true); try{ const r=await axios.post("https://aaryaautogarage.onrender.com/upload",f); setProduct({...product,image:r.data.image}); toast.success("Image uploaded!"); }catch{toast.error("Upload failed");} finally{setUploading(false);} };
  const submit=async(e)=>{ e.preventDefault(); if(!validate())return; setLoading(true); try{ await axios.put(`https://aaryaautogarage.onrender.com/Product/${pid}`,product); navigate("/productlist"); }catch{toast.error("Failed to update product");} finally{setLoading(false);} };

  const FIELDS=[
    {label:"Product Name",name:"part_name",type:"text",   ph:"Product name"},
    {label:"Brand",       name:"brand",     type:"text",   ph:"Brand"},
    {label:"Base Model",  name:"applicability_base_model",type:"text",ph:"e.g. HONDA ACTIVA"},
    {label:"Applicable Models",name:"applicable_model",type:"text",ph:"e.g. Activa 6G | Dio"},
    {label:"Categories",  name:"categories",type:"text",   ph:"Comma-separated"},
    {label:"Price (₹)",   name:"price",     type:"number", ph:"Price"},
    {label:"Stock Qty",   name:"stock_quantity",type:"number",ph:"Stock quantity"},
  ];

  return (
    <Sidebar>
      <div style={{maxWidth:"560px",margin:"0 auto"}}>
        <div style={{background:A.surface,border:`1.5px solid ${A.border}`,borderRadius:"20px",overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
          <div style={{background:A.bg,padding:"1.5rem 2rem",borderBottom:`1px solid ${A.border}`}}>
            <h2 style={{color:A.text,fontSize:"1.15rem",fontWeight:800,margin:0}}>Edit Product</h2>
            <p style={{color:A.muted,fontSize:"0.85rem",margin:"0.3rem 0 0"}}>Update product information</p>
          </div>
          <div style={{padding:"2rem"}}>
            <form onSubmit={submit}>
              {FIELDS.map(f=>(
                <div key={f.name} style={{marginBottom:"1.1rem"}}>
                  <label style={{display:"block",color:A.muted,fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:"0.5rem"}}>{f.label}</label>
                  <input type={f.type} name={f.name} placeholder={f.ph} value={product[f.name]??""} onChange={change}
                    onFocus={()=>setFocused(f.name)} onBlur={()=>setFocused(null)}
                    style={mkInput(focused,f.name,errors[f.name])}/>
                  {errors[f.name]&&<p style={{color:A.danger,fontSize:"0.75rem",margin:"0.3rem 0 0"}}>{errors[f.name]}</p>}
                </div>
              ))}
              <div style={{marginBottom:"1.25rem"}}>
                <label style={{display:"block",color:A.muted,fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:"0.5rem"}}>Product Image</label>
                <div style={{display:"flex",gap:"0.5rem"}}>
                  <input type="file" onChange={e=>setImage(e.target.files[0])} style={{flex:1,padding:"0.6rem",background:A.bg,border:`1.5px solid ${A.border}`,borderRadius:"10px",color:A.muted,fontSize:"0.85rem",outline:"none",fontFamily:A.font}}/>
                  <button type="button" onClick={upload} disabled={uploading}
                    style={{padding:"0.6rem 1rem",background:A.indigoBg,color:A.indigo,border:`1.5px solid ${A.indigoBorder}`,borderRadius:"10px",fontSize:"0.83rem",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",fontFamily:A.font,opacity:uploading?0.7:1}}>
                    {uploading?"Uploading...":"Upload"}
                  </button>
                </div>
                {product.image&&<p style={{color:A.success,fontSize:"0.76rem",marginTop:"0.4rem"}}>✓ Current: {product.image}</p>}
              </div>
              <button type="submit" disabled={loading} style={{width:"100%",padding:"0.88rem",background:"linear-gradient(135deg,#4F46E5,#6366F1)",border:"none",borderRadius:"10px",color:"#fff",fontWeight:700,fontSize:"0.95rem",cursor:loading?"not-allowed":"pointer",fontFamily:A.font,opacity:loading?0.7:1,boxShadow:"0 4px 16px rgba(79,70,229,0.3)",marginTop:"0.5rem"}}>
                {loading?"Updating...":"Update Product →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
export default Editproduct;
