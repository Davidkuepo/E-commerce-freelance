export interface ApiResponsePanier {
  timestamp: number;
  data: {
    panierCode: string;
    dateCreation: number[];
    clientCode: string;
    produits: Array<{
      quantity: number;
      produitCode: string;
      nom: string;
      description: string;
      prix: number;
      stock: number;
      categorie: string;
      state: string;
      image: string;
    }>;
    state: string;
  };
  code: number;
  status: string;
  message: string;
  details: any | null;
}
