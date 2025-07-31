const { Op } = require("sequelize");
const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");
const excelJs = require("exceljs");

exports.entreeSortieeExcel =async (req, res, next) => {
      try {

        // console.log(req.body)
        // Create workbook and worksheet
        let workbook = new excelJs.Workbook();
        let sheet = workbook.addWorksheet("sheet");

        // Set sheet columns
        sheet.columns = [
          { header: "", key: "", width: 10 },
          { header: "PIECE", key: "", width: 10 },
          { header: "DATE", key: "date", width: 15 },
          { header: "REFERENCE", key: "reference", width: 20 },
          { header: "LIBELLE", key: "designation", width: 70 },
          { header: "CODE_JRN", key: "", width: 15 },
          { header: "CODE_COM", key: "", width: 15 },
          { header: "CODE_AUX", key: "", width: 15 },
          { header: "CODE_BDG", key: "", width: 15 },
          { header: "DEBIT", key: "debit", width: 15 },
          { header: "CREDIT", key: "credit", width: 15 },
        ];

        // MAKING ENTRES
        const entrees = await db.Entree.findAll({
            where:{
                MagazinId:req.body.magazins,
                date:{
                    [Op.gte]:req.body.start,
                    [Op.lte]:req.body.end
                }
            },
            attributes:["date","number","total_price","facture"],
            include:[
                {model:db.Fournisseur,attributes:["name"]},
                {model:db.Article,attributes:["name","price","initial_quantity"],include:[{model:db.Ref, attributes:["name"]}]}
            ]
        })
        // MAKING SORTIES
         const sorties = await db.Sortie.findAll({
            where:{
                MagazinId:req.body.magazins,
                date:{
                    [Op.gte]:req.body.start,
                    [Op.lte]:req.body.end
                }
            },
            attributes:["date","number","total_price"],
            include:[
                {model:db.Beneficiare,attributes:["name"]},
                {model:db.ArticleQuiSort,attributes:["price","quantity"],include:[
                    {model:db.Article,attributes:["name"],include:[{model:db.Ref, attributes:["name"]}]}
                ]}
            ]
        })
        // COMPINE THEM 
            // ENTREES
        const clean_entrees = []
        entrees.map(el=>{
            let d =[]
            el.Articles.map(e=>{
                d.push(
                    {
                       date: el.date,
                       reference: e.Ref.name,
                       name: `BE ${el.number}/${e.initial_quantity} ${e.name}`,
                       debit: e.initial_quantity * e.price
                    }
                )
            })
            d.push(
                {
                    date: el.date,
                    reference: el.facture,
                    name:el.Fournisseur.name,
                    credit: el.total_price
                }
            )
            clean_entrees.push(
                {
                    date: el.date,
                    type:"entree",
                    data: d
                }
            )
        })
            // SORTIE 
        let clean_sorties =[]
        sorties.map(el=>{
            let d = []
            let c = []
            el.ArticleQuiSorts.map(e=>{
                d.push(
                    {
                       date: el.date,
                       reference: e.Article?.Ref?.name,
                       name: `BS ${el.number}/${e.quantity} ${e.Article?.name}`,
                       debit: e.quantity * e.price
                    }
                )
                c.push(
                    {
                       date: el.date,
                       reference: e.Article?.Ref?.name,
                       name: `BS ${el.number}/${e.quantity} ${e.Article?.name}`,
                       credit: e.quantity * e.price
                    }
                )
            })
            clean_sorties.push({
                 
                date: el.date,
                type:"sortie",
                data: [...d,...c]
                
            })
                
            
        })


        // Merge both arrays
        let combined = [...clean_entrees, ...clean_sorties];

        // Sort by date first, then by type ("entree" before "sortie")
        combined.sort((a, b) => {
            let dateA = new Date(a.date);
            let dateB = new Date(b.date);

            if (dateA - dateB !== 0) {
                return dateA - dateB; // Sort by date
            }
            return a.type === "entree" ? -1 : 1; // If dates are equal, sort "entree" first
        });

        // console.log(combined);



        

        // MAKE EXCEL
        let rowIndex = 2; // Start from row 2 to leave row 1 for headers
        combined.forEach((entry) => {
            // Add data rows
            entry.data.forEach((row) => {
                let newRow = sheet.addRow({
                    date: row.date,
                    reference: row.reference,
                    designation: row.name,
                    debit: row.debit || "",
                    credit: row.credit || "",
                });

                // Apply center alignment to "DATE" and "REFERENCE"
                newRow.getCell("date").alignment = { horizontal: "center" };
                newRow.getCell("reference").alignment = { horizontal: "center" };
            });

            // Add an empty row after each entry for spacing
            sheet.addRow([]);
        });


        const filename = `Report-${new Date().toISOString().split("T")[0]}.xlsx`;

        // Send response
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.status(200).send(await workbook.xlsx.writeBuffer());
        
   
      } catch (err) {
        console.error("ExportFile Error:", err);
        res.status(500).json({ error: "Failed to export file" });
        next(err);
      }
    };