import StandardTemplate from "@/components/root/template/standard/standard-template";
import React from "react";

const Index = () => {
    const searchOption = [{ field: "name", name: "Bénéficiaire" }];

    const columns = [
        { name: '', field: "sign" }, 
        { name: 'Reference', field: "reference" }, 
        { name: 'Designation', field: "name" }, 
        { name: "Qauntity", field: "quantity" }, 
        { name: "Date", field: "date", },
        { name: "Bénéficiaire", field: "Beneficiare", },
        { name: "Fournisseur", field: "Fournisseur", },
        
        
    ];
    // const inputs = [{ field: "name", name: "Bénéficiaire" }];

    //
    return (
        <StandardTemplate
            searchOption={[{ field: "Ref.name", name: "Reference" },
                { name: 'Designation', field: "name" },
                // { name: "Bénéficiaire", field: "Sortie.Beneficiare.name", },
                // { name: "Fournisseur", field: "Entree.Fournisseur.name", }
            
            
            ]}
            columns={columns}
            root={"movement/article"}
            // onCreateClick={true}
            // onDeleteClick={true}
            panel={true}
            // panelFilter={[{ name: "Reference", field: "Ref", root: "ref" }]}

            // option={true}
            isExport
        // standardEdit={inputs}
        />
    );
};

export default Index;
