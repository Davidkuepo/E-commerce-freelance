export * from './auth.service';
import { AuthService } from './auth.service';
export * from './panier.service';
import { PanierService } from './panier.service';
export * from './products.service';
import { ProductsService } from './products.service';
export * from './produit.service';
import { ProduitService } from './produit.service';
export const APIS = [AuthService, PanierService, ProductsService, ProduitService];
