import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Sale } from "../resources/Sale";
import { getProducts } from "../resources/ProductsFirebase";
import { getServices } from "../resources/ServicesFirebase";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { SelectChangeEvent } from "@mui/material/Select";
import { Product } from "../resources/Product";
import { addSale } from "../resources/SalesFirebase";
import { NavLink } from "react-router-dom";
import { decrementProductQuantity } from "../resources/ProductsFirebase";

const SaleScreen = () => {
  const [products, setProducts] = useState<
    QueryDocumentSnapshot<DocumentData>[] | []
  >([]);
  const [services, setServices] = useState<
    QueryDocumentSnapshot<DocumentData>[] | []
  >([]);

  useEffect(() => {
    getProductsData();
    getServicesData();
  }, []);

  const getProductsData = async () => {
    const fbProducts = await getProducts();
    setProducts(fbProducts.docs);
  };

  const getServicesData = async () => {
    const fbServices = await getServices();
    setServices(fbServices.docs);
  };

  const [productSale, setProductSale] = useState<string[]>([]);
  const [serviceSale, setServiceSale] = useState<string[]>([]);

  const [productQuantities, setProductQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [serviceQuantities, setServiceQuantities] = useState<{
    [key: string]: number;
  }>({});

  const [showSelectedItems, setShowSelectedItems] = useState(false);

  const handleChangeProductSale = (
    event: SelectChangeEvent<string | string[]>
  ) => {
    const selectedProducts = Array.isArray(event.target.value)
      ? event.target.value
      : [event.target.value];
    setProductSale(selectedProducts);
  };

  const handleChangeServiceSale = (
    event: SelectChangeEvent<string | string[]>
  ) => {
    const selectedServices = Array.isArray(event.target.value)
      ? event.target.value
      : [event.target.value];
    setServiceSale(selectedServices);
  };

  const handleChangeProductQuantity = (
    event: React.ChangeEvent<HTMLInputElement>,
    productId: string
  ) => {
    const quantity = parseInt(event.target.value);
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const handleChangeServiceQuantity = (
    event: React.ChangeEvent<HTMLInputElement>,
    serviceId: string
  ) => {
    const quantity = parseInt(event.target.value);
    setServiceQuantities((prevQuantities) => ({
      ...prevQuantities,
      [serviceId]: quantity,
    }));
  };

  const createPurchaseObject = () => {
    const purchaseObject: Sale = {
      products: [],
      services: [],
      subtotal: 0,
      total: 0,
    };

    // Agregar productos seleccionados
    for (const productId of productSale) {
      const productName = getProductName(productId);
      const quantity = productQuantities[productId] || 0;
      const price = Number(getProductPrice(productId));
      const subtotal = getProductSubtotal(productId);

      purchaseObject.products.push({
        id: productId,
        name: productName,
        quantity: quantity,
        price: price,
        subtotal: subtotal,
      });

      purchaseObject.subtotal += subtotal;
    }

    // Agregar servicios seleccionados
    for (const serviceId of serviceSale) {
      const serviceName = getServiceName(serviceId);
      const quantity = serviceQuantities[serviceId] || 0;
      const price = Number(getServicePrice(serviceId));
      const subtotal = getServiceSubtotal(serviceId);

      purchaseObject.services.push({
        id: serviceId,
        name: serviceName,
        quantity: quantity,
        price: price,
        subtotal: subtotal,
      });

      purchaseObject.subtotal += subtotal;
    }

    purchaseObject.total = getTotal();

    return purchaseObject;
  };

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    // Validar si no hay productos o servicios seleccionados
    if (productSale.length === 0 && serviceSale.length === 0) {
      setError("Debe seleccionar al menos un producto o servicio.");
      return;
    }

    // Validar si la cantidad de productos es mayor a 0 y no está vacía
    const invalidProducts = productSale.filter((productId) => {
      const quantity = productQuantities[productId] || 0;
      const stock = getProductStock(productId);
      return quantity <= 0 || quantity > stock;
    });

    if (invalidProducts.length > 0) {
      const invalidProductsNames = invalidProducts.map((productId) => {
        const product = products.find((p) => p.id === productId);
        return product ? product.data().name : "";
      });
      const errorMessage = `Stock insuficiente o cantidad de productos no válida para los siguientes productos: ${invalidProductsNames.join(
        ", "
      )}`;
      setError(errorMessage);
      return;
    }

    // Validar si la cantidad de servicios no está vacía
    const invalidServices = serviceSale.filter((serviceId) => {
      const quantity = serviceQuantities[serviceId] || 0;
      return quantity <= 0;
    });

    if (invalidServices.length > 0) {
      const invalidServicesNames = invalidServices.map((serviceId) => {
        const service = services.find((s) => s.id === serviceId);
        return service ? service.data().name : "";
      });
      const errorMessage = `Cantidad de servicios no válida para los siguientes servicios: ${invalidServicesNames.join(
        ", "
      )}`;
      setError(errorMessage);
      return;
    }

    // Validar si la cantidad de productos y servicios es mayor a 0
    const negativeQuantities = Object.values(productQuantities)
      .concat(Object.values(serviceQuantities))
      .filter((quantity) => quantity < 0);

    if (negativeQuantities.length > 0) {
      const errorMessage = "La cantidad no puede ser menor a cero.";
      setError(errorMessage);
      return;
    }

    // Validación exitosa, crear objeto de compra y guardar la venta
    const purchase = createPurchaseObject();
    const res = await addSale(purchase);
    for (const productId of productSale) {
      const quantity = productQuantities[productId] || 0;
      await decrementProductQuantity(productId, quantity);
    }
    res
      ? setSuccess("Confirmed sale")
      : setError("The sale could not be completed");
  };

  const getProductStock = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      return product.data().stock || 0;
    }
    return 0;
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      return product.data().name || "";
    }
    return "";
  };

  const getProductPrice = (productId: string): number => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      return product.data().pv || 0;
    }
    return 0;
  };

  const getServicePrice = (productId: string): number => {
    const service = services.find((p) => p.id === productId);
    if (service) {
      return service.data().pv || 0;
    }
    return 0;
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find((p) => p.id === serviceId);
    if (service) {
      return service.data().name || "";
    }
    return "";
  };

  const getProductSubtotal = (productId: string) => {
    const quantity = productQuantities[productId] || 0;
    const product = products.find((p) => p.id === productId);
    if (product) {
      const price = product.data().pv || 0;
      return quantity * price;
    }
    return 0;
  };

  const getServiceSubtotal = (serviceId: string) => {
    const quantity = serviceQuantities[serviceId] || 0;
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      const price = service.data().pv || 0;
      return quantity * price;
    }
    return 0;
  };

  const getProductTotal = () => {
    let total = 0;
    for (const productId in productQuantities) {
      total += getProductSubtotal(productId);
    }
    return total;
  };

  const getServiceTotal = () => {
    let total = 0;
    for (const serviceId in serviceQuantities) {
      total += getServiceSubtotal(serviceId);
    }
    return total;
  };

  const getTotal = () => {
    return getProductTotal() + getServiceTotal();
  };

  return (
    <Container>
      <Grid container spacing={2} marginTop={3}>
        <Grid container>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" onClose={() => setSuccess("")}>
                {success}
              </Alert>
            )}
            <Typography variant="h4">Add Sale</Typography>
          </Grid>
        </Grid>
        <Grid container marginTop={3}>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 340, maxWidth: 340 }}
            >
              <InputLabel id="products-label">Products</InputLabel>
              <Select
                labelId="products-label"
                id="products-select"
                value={productSale}
                onChange={handleChangeProductSale}
                label="Productos"
                multiple
              >
                {products.map(
                  (product: QueryDocumentSnapshot<DocumentData>) => {
                    const { name, pv } = product.data() as Product;
                    const { id } = product;

                    return (
                      <MenuItem key={id} value={id}>
                        {name} (Sale price: ${pv})
                      </MenuItem>
                    );
                  }
                )}
              </Select>
            </FormControl>
            <br />
            {productSale.map((productId) => (
              <div key={productId}>
                <FormControl
                  variant="standard"
                  sx={{ m: 1, minWidth: 340, maxWidth: 340 }}
                >
                  <label id={`product-quantity-label-${productId}`}>
                    Quantity for {getProductName(productId)} (Stock:{" "}
                    {getProductStock(productId)})
                  </label>
                  <input
                    type="number"
                    id={`product-quantity-${productId}`}
                    value={productQuantities[productId] || ""}
                    onChange={(e) => handleChangeProductQuantity(e, productId)}
                  />
                </FormControl>
                <Typography variant="body1">
                  Subtotal: ${getProductSubtotal(productId)}
                </Typography>
              </div>
            ))}
            <br />
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 340, maxWidth: 340 }}
            >
              <InputLabel id="services-label">Services</InputLabel>
              <Select
                labelId="services-label"
                id="services-select"
                value={serviceSale}
                onChange={handleChangeServiceSale}
                label="Servicios"
                multiple
              >
                {services.map(
                  (service: QueryDocumentSnapshot<DocumentData>) => {
                    const { name, pv } = service.data() as Product;
                    const { id } = service;

                    return (
                      <MenuItem key={id} value={id}>
                        {name} (Sale price: ${pv})
                      </MenuItem>
                    );
                  }
                )}
              </Select>
            </FormControl>
            <br />
            {serviceSale.map((serviceId) => (
              <div key={serviceId}>
                <FormControl
                  variant="standard"
                  sx={{ m: 1, minWidth: 340, maxWidth: 340 }}
                >
                  <label id={`service-quantity-label-${serviceId}`}>
                    Quantity for {getServiceName(serviceId)}
                  </label>
                  <input
                    type="number"
                    id={`service-quantity-${serviceId}`}
                    value={serviceQuantities[serviceId] || ""}
                    onChange={(e) => handleChangeServiceQuantity(e, serviceId)}
                  />
                </FormControl>
                <Typography variant="body1">
                  Subtotal: ${getServiceSubtotal(serviceId)}
                </Typography>
              </div>
            ))}
            <br />
            <Button
              variant="contained"
              onClick={() => setShowSelectedItems(!showSelectedItems)}
            >
              {showSelectedItems ? "Hide list" : "Show list"}
            </Button>
            {showSelectedItems && (
              <div>
                {productSale.length > 0 ? (
                  <div>
                    <Typography variant="h6">Selected products:</Typography>
                    {productSale.map((productId) => (
                      <div key={productId}>
                        <Typography variant="body1">
                          {getProductName(productId)} (Quantity:{" "}
                          {productQuantities[productId] || 0}, Subtotal: ${""}
                          {getProductSubtotal(productId)})
                        </Typography>
                      </div>
                    ))}
                  </div>
                ) : (
                  <></>
                )}

                {serviceSale.length > 0 ? (
                  <div>
                    <Typography variant="h6">Selected services:</Typography>
                    {serviceSale.map((serviceId) => (
                      <div key={serviceId}>
                        <Typography variant="body1">
                          {getServiceName(serviceId)} (Quantity:{" "}
                          {serviceQuantities[serviceId] || 0}, Subtotal: ${""}
                          {getServiceSubtotal(serviceId)})
                        </Typography>
                      </div>
                    ))}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}

            <Typography variant="h5">Total: ${getTotal()}</Typography>
            <br />
            <Button variant="outlined" onClick={handleSave}>
              Save
            </Button>
            <NavLink to={`/`} className="btn btn-info mx-2">
              Return
            </NavLink>
            <br />
            <br />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SaleScreen;
