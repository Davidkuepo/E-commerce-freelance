import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Attaches a Bearer token from localStorage to outgoing HTTP requests.
 * Ensures authenticated API calls (e.g., Auth, Products, Cart).
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch {
    // localStorage may be unavailable in some environments; ignore silently
  }
  return next(req);
};
