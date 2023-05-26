import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Container, Typography, Divider } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getSale } from "../resources/SalesFirebase";
import { ProductService } from "../resources/ProductService";

export const ViewSale = () => {
  const { id } = useParams();
  const [saleData, setSaleData] = useState<any>(undefined);

  const getData = async () => {
    const data = await getSale(id);
    setSaleData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
      }}
    >
      {saleData ? (
        <div>
          <Typography variant="h4" mb={2}>
            Sale Details
          </Typography>
          <Divider color="black" />
          <Typography variant="body1" gutterBottom>
            Sale Date:{" "}
            {format(
              new Date(saleData.createdAt),
              "d 'de' MMMM 'de' yyyy, HH:mm",
              { locale: es }
            )}
          </Typography>
          <div>
            <Typography variant="h6" mt={4} mb={2}>
              Products
            </Typography>
            <ul>
              {saleData.products.map((product: ProductService) => (
                <li key={product.id}>
                  {product.name}: {product.quantity} x ${product.price} = $
                  {product.subtotal}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Typography variant="h6" mt={4} mb={2}>
              Services
            </Typography>
            <ul>
              {saleData.services.map((service: ProductService) => (
                <li key={service.id}>
                  {service.name}: {service.quantity} x ${service.price} = $
                  {service.subtotal}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Typography variant="h5" gutterBottom>
              Total: ${saleData.total}
            </Typography>
          </div>
          <NavLink to={`/`} className="btn btn-info mx-2">
            Return
          </NavLink>
        </div>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
};
