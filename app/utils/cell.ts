import { Cell } from "../types/sheetName";

export const handleValue = async (id: string , cell : Cell): Promise<string> => {        
    try {
        const response = await fetch(`/api/sheets/${id}/cell`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({cell:cell})
        });
        if (response.ok) {
            return "success";
        } else {
            const error = await response.json();
            return error.message || "An error occurred";
        }
    } catch (error) {
        return `Error: ${error}`;
    }
};
