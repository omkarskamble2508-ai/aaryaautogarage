import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { toast } from "../Components/Toast";

const A = {
  bg:"#F8F9FC",surface:"#FFFFFF",border:"#E4E9F2",
  text:"#111827",sub:"#374151",muted:"#6B7280",
  indigo:"#4F46E5",indigoBg:"#EEF2FF",indigoBorder:"#C7D2FE",
  accent:"#E84A2F",success:"#10B981",danger:"#EF4444",warn:"#F59E0B",
  font:"'Inter','Segoe UI',system-ui,sans-serif"
};

const SC = {
  Ordered:   {color:"#D97706",bg:"#FFFBEB",border:"#FDE68A",dot:"#F59E0B"},
  Accepted:  {color:A.indigo, bg:A.indigoBg,border:A.indigoBorder,dot:A.indigo},
  Delivered: {color:"#059669",bg:"#ECFDF5",border:"#A7F3D0",dot:A.success},
  Declined:  {color:A.danger, bg:"#FFF0F0",border:"#FFC9C9",dot:A.danger},
};

export default function AdminOrders() {
  const navigate=useNavigate();
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(true);
  const [activeTab,setActiveTab]=useState("Ordered");
  const tabs=["Ordered","Accepted","Delivered","Declined"];

  const fetch=()=>{ setLoading(true); axios.get("https://aaryaautogarage.onrender.com/orders/admin").then(r=>setOrders(r.data)).catch(()=>toast.error("Error loading orders")).finally(()=>setLoading(false)); };
  useEffect(()=>{ if(sessionStorage.getItem("ADMIN_AUTH")!=="true"){navigate("/admin");return;} fetch(); },[]);

  const updateStatus=async(id,s)=>{ try{ await axios.put(`https://aaryaautogarage.onrender.com/orders/admin/${id}`,{status:s}); fetch(); toast.success(`Order ${s.toLowerCase()} successfully.`); }catch{ toast.error("Error updating order status"); } };
  const filtered=orders.filter(o=>o.status===activeTab);

  return (
    <Sidebar>
      {/* Tabs */}
      <div style={{display:"flex",gap:"0",marginBottom:"2rem",background:A.surface,border:`1.5px solid ${A.border}`,borderRadius:"12px",overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
        {tabs.map(tab=>{
          const count=orders.filter(o=>o.status===tab).length;
          const active=activeTab===tab;
          const sc=SC[tab]||SC.Ordered;
          return (
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{
              flex:1,padding:"0.9rem 0.5rem",border:"none",
              borderBottom:`3px solid ${active?sc.color:"transparent"}`,
              background:active?`${sc.bg}`:"transparent",
              color:active?sc.color:A.muted,
              fontWeight:active?700:500,fontSize:"0.85rem",
              cursor:"pointer",fontFamily:A.font,transition:"all 0.18s",
              display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",
            }}>
              {tab}
              <span style={{background:active?`${sc.color}20`:A.bg,color:active?sc.color:A.muted,fontSize:"0.7rem",fontWeight:700,padding:"0.1rem 0.5rem",borderRadius:"100px",border:`1px solid ${active?sc.border:A.border}`}}>{count}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{textAlign:"center",padding:"4rem",color:A.muted}}>⏳ Loading orders...</div>
      ) : filtered.length===0 ? (
        <div style={{background:A.surface,border:`1.5px solid ${A.border}`,borderRadius:"16px",padding:"4rem",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
          <div style={{fontSize:"3rem",marginBottom:"1rem"}}>📋</div>
          <p style={{fontWeight:700,color:A.sub,fontSize:"1rem",margin:"0 0 0.3rem"}}>No {activeTab.toLowerCase()} orders</p>
          <p style={{color:A.muted,fontSize:"0.85rem"}}>Orders in this status will appear here.</p>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          {filtered.map(order=>{
            const sc=SC[order.status]||SC.Ordered;
            return (
              <div key={order.order_id} style={{background:A.surface,border:`1.5px solid ${A.border}`,borderRadius:"16px",overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                {/* Card header */}
                <div style={{background:A.bg,padding:"1.1rem 1.5rem",borderBottom:`1px solid ${A.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.3rem"}}>
                      <span style={{fontFamily:"monospace",fontWeight:800,color:A.text,fontSize:"1rem"}}>#{order.order_id}</span>
                      <span style={{background:sc.bg,color:sc.color,border:`1.5px solid ${sc.border}`,padding:"0.18rem 0.75rem",borderRadius:"100px",fontSize:"0.72rem",fontWeight:700,display:"flex",alignItems:"center",gap:"0.35rem"}}>
                        <span style={{width:"5px",height:"5px",borderRadius:"50%",background:sc.dot,display:"inline-block"}}/>
                        {order.status}
                      </span>
                    </div>
                    <div style={{fontSize:"0.78rem",color:A.muted}}>{new Date(order.created_at).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                    <div style={{marginTop:"0.3rem",fontSize:"0.87rem"}}>
                      <strong style={{color:A.text}}>{order.name}</strong>
                      <span style={{color:A.muted}}> · {order.email}</span>
                      {order.mobile_number && <span style={{color:A.muted}}> · 📞 {order.mobile_number}</span>}
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:"1.4rem",fontWeight:900,color:A.accent,letterSpacing:"-0.5px",marginBottom:"0.65rem"}}>₹{Number(order.total_amount).toLocaleString()}</div>
                    <div style={{display:"flex",gap:"0.5rem",justifyContent:"flex-end"}}>
                      {order.status==="Ordered"&&<>
                        <button onClick={()=>updateStatus(order.order_id,"Accepted")}
                          style={{padding:"0.45rem 1rem",border:`1.5px solid ${A.indigoBorder}`,borderRadius:"8px",background:A.indigoBg,color:A.indigo,fontWeight:700,cursor:"pointer",fontSize:"0.82rem",fontFamily:A.font,transition:"all 0.15s"}}
                          onMouseEnter={e=>{e.currentTarget.style.background=A.indigo;e.currentTarget.style.color="#fff";}}
                          onMouseLeave={e=>{e.currentTarget.style.background=A.indigoBg;e.currentTarget.style.color=A.indigo;}}
                        >✓ Accept</button>
                        <button onClick={()=>updateStatus(order.order_id,"Declined")}
                          style={{padding:"0.45rem 1rem",border:`1.5px solid #FFC9C9`,borderRadius:"8px",background:"#FFF0F0",color:A.danger,fontWeight:700,cursor:"pointer",fontSize:"0.82rem",fontFamily:A.font,transition:"all 0.15s"}}
                          onMouseEnter={e=>{e.currentTarget.style.background=A.danger;e.currentTarget.style.color="#fff";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="#FFF0F0";e.currentTarget.style.color=A.danger;}}
                        >✕ Decline</button>
                      </>}
                      {order.status==="Accepted"&&
                        <button onClick={()=>updateStatus(order.order_id,"Delivered")}
                          style={{padding:"0.45rem 1rem",border:`1.5px solid #A7F3D0`,borderRadius:"8px",background:"#ECFDF5",color:"#059669",fontWeight:700,cursor:"pointer",fontSize:"0.82rem",fontFamily:A.font,transition:"all 0.15s"}}
                          onMouseEnter={e=>{e.currentTarget.style.background="#059669";e.currentTarget.style.color="#fff";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="#ECFDF5";e.currentTarget.style.color="#059669";}}
                        >📦 Mark Delivered</button>}
                      {order.status==="Delivered"&&<span style={{color:"#059669",fontWeight:700,fontSize:"0.85rem"}}>✓ Completed</span>}
                      {order.status==="Declined"&&<span style={{color:A.danger,fontWeight:700,fontSize:"0.85rem"}}>✕ Declined</span>}
                    </div>
                  </div>
                </div>
                {/* Items */}
                <div style={{padding:"1rem 1.5rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                  {order.items?.map(item=>(
                    <div key={item.order_item_id} style={{display:"flex",justifyContent:"space-between",fontSize:"0.86rem",background:A.bg,padding:"0.65rem 1rem",borderRadius:"8px",border:`1px solid ${A.border}`}}>
                      <span style={{color:A.sub,fontWeight:600}}>{item.quantity}× {item.part_name}</span>
                      <span style={{color:A.accent,fontWeight:800}}>₹{(item.price*item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Sidebar>
  );
}
