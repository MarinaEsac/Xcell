import { ExtendedColumn } from "../sheets/[id]/page";

export const handleColumnName = async (id: string , column : ExtendedColumn): Promise<{message : string, columns? : ExtendedColumn[]}> => {    
    
    try {
        delete column.cells;
        const response = await fetch(`/api/sheets/${id}/changeTheNameOfColumn`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({column:column})
        });
        const data :{message : string, columns : ExtendedColumn[]} = await response.json();
        if (response.ok) {
            return {message : "success" , columns : data.columns};
        } else {
            const error = await response.json();
            return { message: error.message || "An error occurred" };
        }
    } catch (error) {
        return {message : `Error: ${error}`} ;
    }
};

  