import Li from "@/components/base/list/li";
import CircleLogo from "@/components/design/circle-logo";
import React from "react";

export default function SideBar() {
  const lists = [
    {
      title: "Gestion des Entrées",
      subNav: [
        { title: "Liste des Entrées", field: "entree" },
        { title: "Créer une Entrée", field: "entree/create" },
        { title: "Articles Entrants", field: "entree/article" },
      ],
    },

    {
      title: "Gestion des Sorties",
      subNav: [
        { title: "Bons de Sortie", field: "sortie" },
        { title: "Créer une Sortie", field: "sortie/create" },
        { title: "Articles Sortants", field: "sortie/article" },
      ],
    },
    {
      title: "Statistique",
      subNav: [
        { title: "Stock réel", field: "alert" },
        { title: "Rapport des entrees/sorties", field: "movement" },
        { title: "Movement des articles", field: "movement/article" },
      ],
    },
    {
      title: "Gestion du Gasoil",
      subNav: [
        { title: "Entree de gasoil", field: "gasoilentree" },
        { title: "Bons de Sortie de gasoil", field: "gasoilsortie" },
        { title: "Créer une Sortie de gaosil", field: "gasoilsortie/create" },
        { title: "Créer une Sortie de gaosil sans vehicule", field: "gasoil" },
      ],
    },
    {
      title: "filiares",
      subNav: [
        { title: "Références", field: "reference" },
        { title: "Gestion des Véhicules", field: "vehicule" },
        { title: "Gestion des Fournisseurs", field: "fournisseur" },
        { title: "Familles de Produits", field: "family" },
        { title: "Bénéficiaires", field: "beneficiare" },
        { title: "Marques des Vehicule", field: "engin" },
      ],
    },
    {
      title: "Nominations",
      subNav: [
        { title: "Nomination des Unités de Mesure", field: "unit" },
        { title: "Nomination des pieces", field: "tag" },
        { title: "Nomination des Marques", field: "brand" },
      ],
    },
    // {
    //   title: "autres",
    //   subNav: [
    //     { title: "feedback", field: "feedback" },
    //     { title: "Option", field: "settings" },
    //     // { title: "History", field: "histroy" },
    //   ],
    // },
  ];

  return (
    <div className="bg-white  h-screen shadow overflow-hidden flex flex-col gap-2 p-4 align-middle items-start justify-start">
      <div
        className={`flex h-12 cursor-pointer justify-between items-center gap-2 pl-1 flex-1`}
      >
        <CircleLogo width={"40px"} fill={"#0066cc"} />
        <div className="font-bold text-[20px]">GESTION DE STOCK</div>
      </div>
      <div className=" w-full flex flex-col justify-start  h-[90vh]  gap-2 overflow-y-scroll">
        {lists.map((el) => {
          return <Li key={crypto.randomUUID()} element={el} />;
        })}
      </div>
    </div>
  );
}
