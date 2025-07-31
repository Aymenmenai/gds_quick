import StandardTemplate from "@/components/root/template/standard/standard-template";
import React from "react";

const Index = () => {

    const columns = [
        { name: '', field: "sign" }, { name: 'Document', field: "type" }, { name: "prix total", field: "p" }, { name: "date", field: "date" }, { name: "Cree par", field: "user" }
    ];

    return (
        <StandardTemplate
            columns={columns}
            root={"movement/entree"}
            panel={true}
            isExport
        />
    );
};

export default Index;
