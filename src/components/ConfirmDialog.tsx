export default function ConfirmDialog({ask, onYes}:{ask:string,onYes:()=>void}){
  return (
    <div style={{display:'inline'}}>
      <button className="button danger" onClick={()=>{ if (confirm(ask)) onYes() }}>Hapus</button>
    </div>
  )
}
