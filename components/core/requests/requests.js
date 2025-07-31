const axios = require("axios");
const { useQuery, useMutation } = require("react-query");

// UNIT
exports.getUnit = () => {
  const units = useQuery("units", () => {
    return axios.get("/api/v1/unit/option");
  });
  return units;
};

// sousFamily
exports.getsousFamily = () => {
  const sousFamilies = useQuery("sousFamilies", () => {
    return axios.get("/api/v1/sousFamily/option");
  });
  return sousFamilies;
};

// Family
exports.getFamily = () => {
  const Families = useQuery("Families", () => {
    return axios.get("/api/v1/Family/option");
  });
  return Families;
};

// TAG
exports.getTag = () => {
  const tags = useQuery("tags", () => {
    return axios.get("/api/v1/tag/option");
  });
  return tags;
};

// BRAND
exports.getBrand = () => {
  const brands = useQuery("brands", () => {
    return axios.get("/api/v1/brand/option");
  });
  return brands;
};

// REFERENCE
exports.getReference = () => {
  const references = useQuery("references", () => {
    return axios.get("/api/v1/reference/option");
  });
  return references;
};

// REF
exports.getRef = () => {
  const refs = useQuery("refs", () => {
    return axios.get("/api/v1/ref/option");
  });
  return refs;
};

// FOURNISSEUR
exports.getFournisseur = () => {
  const fournisseurs = useQuery("fournisseurs", () => {
    return axios.get("/api/v1/fournisseur/option");
  });
  return fournisseurs;
};

// BRAND
exports.getBrand = () => {
  const fournisseurs = useQuery("brands", () => {
    return axios.get("/api/v1/brand/option");
  });
  return fournisseurs;
};

////////////////////////////////////////////////////////////////////////////////////// FINAL WORK
// // GET API
exports.getApi = (model) => {
  const data = useQuery(`${model}s`, () => {
    return axios.get(`/api/v1/${model}/option`);
  });
  return data;
};

// // MUTATION
// export const postApi = (root) => {
//   const mutation = useMutation({
//     mutationFn: (obj) => {
//       return axios.post(`/api/v1/${root}/add`, { name: obj });
//     },
//   });
//   return mutation;
// };

// // SPECIAL FUNCTION
// // GENERATE RL REFERENCE
// export const getReference = () => {
//   const mutation = useMutation({
//     mutationFn: (id) => {
//       return axios.post(`/api/v1/reference/generate/${id}`);
//     },
//   });
//   return mutation;
// };

// // ALERT
// export const getAlert = () => {
//   const alert = useQuery("alert", () => {
//     return axios.get("/api/v1/article/alert");
//   });
//   return alert;
// };

// // COUNTER
// export const counter = () => {
//   const count = useQuery(
//     "count",
//     () => {
//       return axios.get("/api/v1/entree/count");
//     },
//     { refetchOnWindowFocus: false }
//   );
//   return count;
// };
