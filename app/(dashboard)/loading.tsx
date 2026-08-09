export default function Loading(){
 return <div className="skeletonPage">
  <div className="sk skTitle"/>
  <div className="skGrid">{Array.from({length:5}).map((_,i)=><div className="sk skCard" key={i}/>)}</div>
  <div className="sk skPanel"/>
 </div>
}
