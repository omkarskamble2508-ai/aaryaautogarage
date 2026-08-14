import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const A = {
  bg:"#F8F9FC",surface:"#FFFFFF",border:"#E4E9F2",
  text:"#111827",sub:"#374151",muted:"#6B7280",
  indigo:"#4F46E5",indigoBg:"#EEF2FF",indigoBorder:"#C7D2FE",
  accent:"#E84A2F",danger:"#EF4444",
  font:"'Inter','Segoe UI',system-ui,sans-serif"
};
const th = {padding:"0.7rem 1rem",textAlign:"left",color:A.muted,fontSize:"0.68rem",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase"};
const td = {padding:"0.85rem 1rem",color:A.text,fontSize:"0.86rem",verticalAlign:"middle",borderBottom:`1px solid ${A.border}`};

function ProductList() {
  const [products,setProducts]=useState([]);
  const [psearch, setpsearch]=useState("");
  const [page,setPage]=useState(1);
  const [totalPages,setTotalPages]=useState(1);
  const limit=10;

  const load = async()=>{ const r=await axios.get(`http://localhost:3000/pagination?page=${page}&limit=${limit}`); setProducts(r.data.data); setTotalPages(r.data.totalPages); };
  useEffect(()=>{ load(); },[page]);
  const del = async(pid)=>{ if(window.confirm("Delete this product?")){ await axios.delete(`http://localhost:3000/Product/${pid}`); load(); } };
  const search = async()=>{ const r=await axios.post("http://localhost:3000/psearch",{customer_name:psearch}); setProducts(r.data); };
  const reset  = ()=>{ setpsearch(""); load(); };

  return (
    <Sidebar>
      {/* Header row */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem",flexWrap:"wrap",gap:"0.75rem"}}>
        <Link to="/addproduct" style={{background:"linear-gradient(135deg,#4F46E5,#6366F1)",color:"#fff",border:"none",borderRadius:"10px",padding:"0.6rem 1.25rem",fontSize:"0.87rem",fontWeight:700,cursor:"pointer",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"0.4rem",fontFamily:A.font,boxShadow:"0 3px 12px rgba(79,70,229,0.3)"}}>
          + Add Product
        </Link>
        <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
          <input type="text" placeholder="Search product..." value={psearch} onChange={e=>setpsearch(e.target.value)}
            style={{background:A.bg,border:`1.5px solid ${A.border}`,color:A.text,borderRadius:"8px",padding:"0.6rem 0.9rem",fontSize:"0.86rem",outline:"none",width:"220px",fontFamily:A.font,transition:"border-color 0.2s"}}
            onFocus={e=>e.target.style.borderColor=A.indigo} onBlur={e=>e.target.style.borderColor=A.border}/>
          <button onClick={search} style={{background:A.indigoBg,color:A.indigo,border:`1.5px solid ${A.indigoBorder}`,borderRadius:"8px",padding:"0.58rem 1rem",fontSize:"0.83rem",fontWeight:700,cursor:"pointer",fontFamily:A.font}}>Search</button>
          <button onClick={reset}  style={{background:A.bg,color:A.muted,border:`1.5px solid ${A.border}`,borderRadius:"8px",padding:"0.58rem 1rem",fontSize:"0.83rem",cursor:"pointer",fontFamily:A.font}}>Reset</button>
        </div>
      </div>

      {products.length===0 ? (
        <div style={{background:A.surface,border:`1.5px solid ${A.border}`,borderRadius:"16px",padding:"5rem 2rem",textAlign:"center",color:A.muted}}>
          <div style={{fontSize:"3rem",marginBottom:"1rem"}}>📦</div>
          <p style={{fontWeight:700,color:A.sub,fontSize:"1rem",margin:"0 0 0.3rem"}}>No Products Found</p>
          <p style={{fontSize:"0.85rem"}}>Add your first product to get started.</p>
        </div>
      ) : (
        <>
          <div style={{background:A.surface,border:`1.5px solid ${A.border}`,borderRadius:"16px",overflowX:"auto",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
            <table style={{width:"100%",minWidth:"700px",borderCollapse:"collapse",fontFamily:A.font}}>
              <thead style={{background:A.bg,borderBottom:`1px solid ${A.border}`}}>
                <tr>{["#","Product","Description","MRP","Stock","Actions"].map(h=><th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {products.map(u=>(
                  <tr key={u.pid} onMouseEnter={e=>e.currentTarget.style.background=A.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{...td,color:A.muted,width:"52px"}}>{u.pid}</td>
                    <td style={td}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.65rem"}}>
                        {u.pimage
                          ? <img src={u.pimage} alt="" style={{width:"36px",height:"36px",borderRadius:"8px",objectFit:"cover",flexShrink:0,border:`1px solid ${A.border}`}}/>
                          : <div style={{width:"36px",height:"36px",borderRadius:"8px",background:A.indigoBg,border:`1px solid ${A.indigoBorder}`,display:"flex",alignItems:"center",justifyContent:"center",color:A.indigo,fontWeight:800,flexShrink:0,fontSize:"0.78rem"}}>{u.pname?.charAt(0)||"P"}</div>
                        }
                        <span style={{fontWeight:700,color:A.text}}>{u.pname}</span>
                      </div>
                    </td>
                    <td style={{...td,color:A.muted,maxWidth:"200px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.pdisc||"—"}</td>
                    <td style={td}><span style={{color:A.accent,fontWeight:800,fontSize:"0.92rem"}}>₹{Number(u.pmrp).toLocaleString()}</span></td>
                    <td style={{...td,color:A.sub,fontWeight:600}}>{u.stock_quantity??"-"}</td>
                    <td style={td}>
                      <div style={{display:"flex",gap:"0.5rem"}}>
                        <Link to={`/editp/${u.pid}`}
                          style={{padding:"0.34rem 0.75rem",background:A.bg,border:`1.5px solid ${A.border}`,borderRadius:"7px",color:A.muted,fontSize:"0.76rem",textDecoration:"none",display:"inline-block",fontFamily:A.font,transition:"all 0.15s"}}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor=A.indigo;e.currentTarget.style.color=A.indigo;}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor=A.border;e.currentTarget.style.color=A.muted;}}
                        >Edit</Link>
                        <button onClick={()=>del(u.pid)}
                          style={{padding:"0.34rem 0.75rem",background:"#FFF0F0",border:"1.5px solid #FFC9C9",borderRadius:"7px",color:A.danger,fontSize:"0.76rem",cursor:"pointer",fontFamily:A.font,transition:"all 0.15s"}}
                          onMouseEnter={e=>{e.currentTarget.style.background=A.danger;e.currentTarget.style.color="#fff";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="#FFF0F0";e.currentTarget.style.color=A.danger;}}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem",padding:"1.5rem"}}>
            <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
              style={{background:page===1?"#F3F4F6":"linear-gradient(135deg,#4F46E5,#6366F1)",color:page===1?A.muted:"#fff",border:`1.5px solid ${page===1?A.border:A.indigo}`,borderRadius:"8px",padding:"0.5rem 1.25rem",fontSize:"0.83rem",fontWeight:700,cursor:page===1?"not-allowed":"pointer",opacity:page===1?0.5:1,fontFamily:A.font}}>← Prev</button>
            <span style={{color:A.muted,fontSize:"0.83rem",fontWeight:600}}>Page {page} of {totalPages}</span>
            <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
              style={{background:page===totalPages?"#F3F4F6":"linear-gradient(135deg,#4F46E5,#6366F1)",color:page===totalPages?A.muted:"#fff",border:`1.5px solid ${page===totalPages?A.border:A.indigo}`,borderRadius:"8px",padding:"0.5rem 1.25rem",fontSize:"0.83rem",fontWeight:700,cursor:page===totalPages?"not-allowed":"pointer",opacity:page===totalPages?0.5:1,fontFamily:A.font}}>Next →</button>
          </div>
        </>
      )}
    </Sidebar>
  );
}
export default ProductList;