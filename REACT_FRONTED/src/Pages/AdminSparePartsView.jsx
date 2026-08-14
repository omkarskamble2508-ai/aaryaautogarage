import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { toast } from "../Components/Toast";

const A = {
  bg:"#F8F9FC", surface:"#FFFFFF", border:"#E4E9F2",
  text:"#111827", sub:"#374151", muted:"#6B7280",
  indigo:"#4F46E5", indigoBg:"#EEF2FF", indigoBorder:"#C7D2FE",
  accent:"#E84A2F", success:"#10B981", danger:"#EF4444",
  warn:"#F59E0B", font:"'Inter','Segoe UI',system-ui,sans-serif"
};

const CATS = ["All","Engine","Brakes","Electrical","Body","Suspension","Cables","Filters"];

function AdminSparePartsView() {
  const [parts,       setParts]       = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("All");
  const [loading,     setLoading]     = useState(true);
  const [editingStock,setEditingStock]= useState(null);
  const [stockInput,  setStockInput]  = useState("");
  const [savingId,    setSavingId]    = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const load = async () => {
    setLoading(true);
    try { const r = await axios.get("http://localhost:3000/spare_parts"); setParts(r.data); setFiltered(r.data); }
    catch(e){ console.error(e); } finally { setLoading(false); }
  };
  useEffect(()=>{ load(); },[]);

  useEffect(()=>{
    let r = parts;
    const q = search.toLowerCase();
    if(q) r = r.filter(p=>p.part_name?.toLowerCase().includes(q)||p.brand?.toLowerCase().includes(q));
    if(category!=="All") r = r.filter(p=>p.categories?.toLowerCase().includes(category.toLowerCase()));
    setFiltered(r);
    setCurrentPage(1);
  },[search,category,parts]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalValue = parts.reduce((s,p)=>s+Number(p.price)*Number(p.stock_quantity),0);
  const lowStock   = parts.filter(p=>p.stock_quantity<=5&&p.stock_quantity>0).length;
  const outOfStock = parts.filter(p=>p.stock_quantity<=0).length;

  const stockInfo = (qty) => {
    if(qty<=0)  return {label:"Out of Stock",color:A.danger,bg:"#FFF0F0",border:"#FFC9C9"};
    if(qty<=5)  return {label:`Low — ${qty}`, color:A.warn,  bg:"#FFFBEB",border:"#FDE68A"};
    return            {label:`In Stock (${qty})`,color:A.success,bg:"#ECFDF5",border:"#A7F3D0"};
  };

  const saveStock = async(partId)=>{
    const n = parseInt(stockInput,10);
    if(isNaN(n)||n<0){toast.warning("Enter a valid quantity (0 or more)");return;}
    setSavingId(partId);
    try{
      await axios.put(`http://localhost:3000/spare_parts/${partId}`,{stock_quantity:n});
      setParts(prev=>prev.map(p=>p.part_id===partId?{...p,stock_quantity:n}:p));
      setEditingStock(null);
      toast.success("Stock updated successfully!");
    }catch(e){toast.error("Failed: "+(e.response?.data?.message||e.message));}
    finally{setSavingId(null);}
  };

  const th = {padding:"0.7rem 1rem",textAlign:"left",color:A.muted,fontSize:"0.68rem",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase"};
  const td = {padding:"0.85rem 1rem",color:A.text,fontSize:"0.86rem",verticalAlign:"middle",borderBottom:`1px solid ${A.border}`};

  return (
    <Sidebar>
      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:"1rem",marginBottom:"1.75rem"}}>
        {[
          {icon:"🔧",num:parts.length,           label:"Total Parts",      color:A.indigo,bg:A.indigoBg},
          {icon:"💰",num:`₹${totalValue.toLocaleString()}`,label:"Inventory Value",color:"#059669",bg:"#ECFDF5"},
          {icon:"⚠️",num:lowStock,                label:"Low Stock",        color:A.warn,  bg:"#FFFBEB"},
          {icon:"❌",num:outOfStock,              label:"Out of Stock",     color:A.danger,bg:"#FFF0F0"},
        ].map(s=>(
          <div key={s.label} style={{background:A.surface,border:`1.5px solid ${A.border}`,borderRadius:"14px",padding:"1.25rem 1.5rem",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:"1.5rem",marginBottom:"0.5rem"}}>{s.icon}</div>
            <div style={{fontSize:"1.5rem",fontWeight:900,color:s.color,letterSpacing:"-0.5px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}} title={s.num}>{s.num}</div>
            <div style={{color:A.muted,fontSize:"0.78rem",marginTop:"0.2rem",fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap",alignItems:"center",marginBottom:"1.25rem",background:A.surface,border:`1.5px solid ${A.border}`,borderRadius:"12px",padding:"0.85rem 1rem"}}>
        <div style={{position:"relative",flex:1,minWidth:"200px"}}>
          <span style={{position:"absolute",left:"0.8rem",top:"50%",transform:"translateY(-50%)",color:A.muted}}>🔍</span>
          <input type="text" placeholder="Search by name or brand..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{width:"100%",boxSizing:"border-box",padding:"0.6rem 0.9rem 0.6rem 2.3rem",background:A.bg,border:`1.5px solid ${A.border}`,borderRadius:"8px",color:A.text,fontSize:"0.87rem",outline:"none",fontFamily:A.font,transition:"border-color 0.2s"}}
            onFocus={e=>e.target.style.borderColor=A.indigo} onBlur={e=>e.target.style.borderColor=A.border}
          />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(90px, 1fr))",gap:"0.4rem",flex:1,minWidth:"300px"}}>
          {CATS.map(cat=>{
            const active=category===cat;
            return <button key={cat} onClick={()=>setCategory(cat)} style={{padding:"0.4rem 0.5rem",background:active?A.indigoBg:"transparent",border:`1.5px solid ${active?A.indigoBorder:A.border}`,borderRadius:"8px",color:active?A.indigo:A.muted,fontSize:"0.75rem",fontWeight:active?700:600,cursor:"pointer",fontFamily:A.font,transition:"all 0.15s",width:"100%",textAlign:"center"}}>{cat}</button>;
          })}
        </div>
        <span style={{color:A.muted,fontSize:"0.8rem",whiteSpace:"nowrap",fontWeight:600,marginLeft:"auto"}}>{filtered.length}/{parts.length} parts</span>
      </div>

      {/* Table */}
      <div style={{background:A.surface,border:`1.5px solid ${A.border}`,borderRadius:"16px",overflowX:"auto",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
        {loading ? (
          <div style={{textAlign:"center",padding:"4rem",color:A.muted}}>⏳ Loading parts...</div>
        ) : filtered.length===0 ? (
          <div style={{textAlign:"center",padding:"4rem",color:A.muted}}>
            <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>🔍</div>
            <p style={{fontWeight:700,color:A.sub}}>No parts found</p>
            <p style={{fontSize:"0.85rem"}}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <table style={{width:"100%",minWidth:"800px",borderCollapse:"collapse",fontFamily:A.font}}>
            <thead style={{background:A.bg,borderBottom:`1px solid ${A.border}`}}>
              <tr>
                {["#","Part","Category","Price","Stock","Quick Edit","Actions"].map(h=><th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((part,idx)=>{
                const si = stockInfo(part.stock_quantity);
                const isEditing = editingStock===part.part_id;
                const isSaving  = savingId===part.part_id;
                return (
                  <tr key={part.part_id}
                    onMouseEnter={e=>e.currentTarget.style.background=A.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <td style={{...td,color:A.muted,width:"48px"}}>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td style={td}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                        {part.image
                          ? <img src={part.image} alt="" style={{width:"40px",height:"40px",borderRadius:"8px",objectFit:"cover",flexShrink:0,border:`1px solid ${A.border}`}}/>
                          : <div style={{width:"40px",height:"40px",borderRadius:"8px",background:A.indigoBg,border:`1px solid ${A.indigoBorder}`,display:"flex",alignItems:"center",justifyContent:"center",color:A.indigo,fontWeight:800,flexShrink:0}}>{part.part_name?.charAt(0)||"P"}</div>
                        }
                        <div>
                          <span style={{color:A.text,fontWeight:700,fontSize:"0.88rem",display:"block"}}>{part.part_name}</span>
                          <span style={{color:A.muted,fontSize:"0.74rem"}}>{part.brand||"—"}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{...td, maxWidth:"220px"}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.35rem"}}>
                        {(part.categories||"General").split(",").map(c=>c.trim()).filter(Boolean).slice(0,2).map(c=>(
                          <span key={c} style={{background:A.indigoBg,color:A.indigo,border:`1px solid ${A.indigoBorder}`,borderRadius:"6px",padding:"0.2rem 0.4rem",fontSize:"0.65rem",fontWeight:700,textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c}</span>
                        ))}
                        {((part.categories||"").split(",").filter(Boolean).length > 2) && (
                          <span style={{background:A.bg,color:A.muted,border:`1px solid ${A.border}`,borderRadius:"6px",padding:"0.2rem 0.4rem",fontSize:"0.65rem",fontWeight:700,textAlign:"center"}}>+{part.categories.split(",").filter(Boolean).length-2}</span>
                        )}
                      </div>
                    </td>
                    <td style={td}><span style={{color:A.accent,fontWeight:800,fontSize:"0.95rem"}}>₹{Number(part.price).toLocaleString()}</span></td>
                    <td style={td}>
                      <span style={{background:si.bg,color:si.color,border:`1px solid ${si.border}`,borderRadius:"100px",padding:"0.2rem 0.65rem",fontSize:"0.72rem",fontWeight:700,whiteSpace:"nowrap"}}>{si.label}</span>
                    </td>
                    <td style={td}>
                      {isEditing ? (
                        <div style={{display:"flex",alignItems:"center",gap:"0.4rem"}}>
                          <input type="number" min="0" value={stockInput} onChange={e=>setStockInput(e.target.value)} autoFocus
                            style={{width:"64px",padding:"0.38rem 0.55rem",background:A.bg,border:`1.5px solid ${A.indigo}`,borderRadius:"6px",color:A.text,fontSize:"0.85rem",outline:"none",fontFamily:A.font}}/>
                          <button onClick={()=>saveStock(part.part_id)} disabled={isSaving}
                            style={{padding:"0.38rem 0.7rem",background:A.indigo,border:"none",borderRadius:"6px",color:"#fff",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",opacity:isSaving?0.65:1}}>{isSaving?"...":"Save"}</button>
                          <button onClick={()=>setEditingStock(null)}
                            style={{padding:"0.38rem 0.7rem",background:A.bg,border:`1.5px solid ${A.border}`,borderRadius:"6px",color:A.muted,fontSize:"0.75rem",cursor:"pointer"}}>✕</button>
                        </div>
                      ) : (
                        <button onClick={()=>{setEditingStock(part.part_id);setStockInput(String(part.stock_quantity));}}
                          style={{padding:"0.35rem 0.75rem",background:A.bg,border:`1.5px solid ${A.border}`,borderRadius:"7px",color:A.muted,fontSize:"0.76rem",cursor:"pointer",fontFamily:A.font,transition:"all 0.15s"}}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor=A.indigo;e.currentTarget.style.color=A.indigo;}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor=A.border;e.currentTarget.style.color=A.muted;}}
                        >Edit Stock</button>
                      )}
                    </td>
                    <td style={td}>
                      <Link to={`/editp/${part.part_id}`}
                        style={{padding:"0.35rem 0.75rem",background:A.bg,border:`1.5px solid ${A.border}`,borderRadius:"7px",color:A.muted,fontSize:"0.76rem",textDecoration:"none",display:"inline-block",fontFamily:A.font,transition:"all 0.15s"}}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=A.indigo;e.currentTarget.style.color=A.indigo;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=A.border;e.currentTarget.style.color=A.muted;}}
                      >Edit</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && filtered.length > 0 && (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"1.25rem",background:A.surface,padding:"1rem",border:`1.5px solid ${A.border}`,borderRadius:"16px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            style={{padding:"0.5rem 1rem",background:currentPage === 1 ? A.bg : A.indigo,color:currentPage === 1 ? A.muted : "#fff",border:currentPage === 1 ? `1px solid ${A.border}` : "none",borderRadius:"8px",cursor:currentPage === 1 ? "not-allowed" : "pointer",fontFamily:A.font,fontWeight:600,transition:"all 0.15s"}}
          >Previous</button>
          
          <span style={{color:A.sub,fontSize:"0.85rem",fontWeight:600}}>Page {currentPage} of {totalPages}</span>
          
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            style={{padding:"0.5rem 1rem",background:currentPage === totalPages ? A.bg : A.indigo,color:currentPage === totalPages ? A.muted : "#fff",border:currentPage === totalPages ? `1px solid ${A.border}` : "none",borderRadius:"8px",cursor:currentPage === totalPages ? "not-allowed" : "pointer",fontFamily:A.font,fontWeight:600,transition:"all 0.15s"}}
          >Next</button>
        </div>
      )}
    </Sidebar>
  );
}
export default AdminSparePartsView;
