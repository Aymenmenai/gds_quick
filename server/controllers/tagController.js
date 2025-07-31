const { where } = require("sequelize");
const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");
const reqHandler = require("./reqHandler");
const QueryBuilder = require("../utils/QueryBuilder");

const include = [
    {
        model: db.TagHistory,
        where: { data: "name" },
        order: [['createdAt', 'DESC']],  // Get the latest entry by descending order
        attributes: ["prevVal", "data", "createdAt"],
        limit: 1  // Limit to one entry to retrieve the latest history
    },
    {
        model: db.User,
        attributes: ["name"],
    }
];
exports.findTag = reqHandler.Options(db.Tag)
exports.getAllTag = async (req, res, next) => {
    try {
        const queryBuilder = new QueryBuilder(req.query);
        const { result } = queryBuilder
            .buildSorting()
            .buildFilter()
            .buildAttributes();

        // Build and clean query based on model type
        const cleanedQuery = { ...result };

        cleanedQuery.where = { ...cleanedQuery.where, MagazinId: req.user.MagazinId };

        // Define includes with TagHistory and User models
        const include = [
            {
                model: db.TagHistory,
                where: { data: "name" },
                order: [['createdAt', 'DESC']],
                limit: 1, // Only get the latest TagHistory entry
                attributes: ["prevVal", "data", "createdAt","UserId"],
                include: [
                    {
                        model: db.User,
                        attributes: ["name"],
                    },
                ],
            },
            {
                model: db.User,
                attributes: ["name"],
            },
        ];

        // Fetch the main documents with the optimized query
        const doc = await db.Tag.findAll({
            include,
            ...cleanedQuery,
            required: true,
            duplicating: false,
        });

        // Calculate total document length
        const { limit, offset, page, ...restQuery } = cleanedQuery;
        const totalDocs = await db.Tag.count({ ...restQuery, include });

        // If no documents found, return a success response with empty data
        if (totalDocs === 0) {
            sendRes(res, 200, {
                doc_size: 0,
                pages: 1,
                currPage: 1,
                data: [],
            });
            return next();
        }

        // Transform TagHistories to an object if not empty
        const data = doc.map(item => {
            const plainItem = item.get({ plain: true });
            
            // Convert TagHistories array to object
            if (plainItem.TagHistories && plainItem.TagHistories.length > 0) {
                plainItem.TagHistories = plainItem.TagHistories[0];
            } else {
                plainItem.TagHistories = {}; // Return as empty object if no history
            }

            return plainItem;
        });

        // Calculate pages based on limit and totalDocs
        const totalPages = limit ? Math.ceil(totalDocs / limit) : 1;

        sendRes(res, 200, {
            doc_size: totalDocs,
            pages: totalPages,
            currPage: +req.query.page || 1,
            data,
        });
        return next();
    } catch (err) {
        console.error(err);
        return next();
    }
};

exports.getOneTag = reqHandler.FindOne(db.Tag);
exports.deleteTag = reqHandler.DeleteOne(db.Tag, db.TagHistory, "TagId");
exports.updateTag = reqHandler.UpdateOne(db.Tag, db.TagHistory, "TagId");
exports.createTag = reqHandler.Create(db.Tag);
