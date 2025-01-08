export interface Sheet{
  id:string , email:string , sheetName:string , cells:Cell[] , columns:Column[] , rows:Row[]
}
export interface Cell{
    colId:string , rowId:string , value:string
}
export interface Column{
    id:string , name:string
}
export interface Row{
    id:string
}