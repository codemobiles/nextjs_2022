import { Box, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik, FormikProps } from "formik";
import { TextField } from "formik-material-ui";

import { useAppDispatch } from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ProductData } from "@/models/product.model";
import { addProduct } from "@/services/serverService";
import Layout from "@/components/Layouts/Layout";

const AddStock = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const showForm = ({ values, setFieldValue }: FormikProps<ProductData>) => {
    return (
      <Form>
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <Typography gutterBottom variant="h3">
              Create Stock
            </Typography>

            <Field style={{ marginTop: 16 }} fullWidth component={TextField} name="name" type="text" label="Name" />
            <br />
            <Field style={{ marginTop: 16 }} fullWidth component={TextField} name="price" type="number" label="Price" />

            <Field style={{ marginTop: 16 }} fullWidth component={TextField} name="stock" type="number" label="Stock" />

            <div style={{ margin: 16 }}>{showPreviewImage(values)}</div>

            <div>
              <Image alt="product image" src="/static/img/ic_photo.png" width={25} height={20} />
              <span style={{ color: "#00B0CD", marginLeft: 10 }}>Add Picture</span>

              <input
                type="file"
                onChange={(e: React.ChangeEvent<any>) => {
                  e.preventDefault();
                  setFieldValue("file", e.target.files[0]); // for upload
                  setFieldValue("file_obj", URL.createObjectURL(e.target.files[0])); // for preview image
                }}
                name="image"
                click-type="type1"
                multiple
                accept="image/*"
                id="files"
                style={{ padding: "20px 0 0 20px" }}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button fullWidth variant="contained" color="primary" type="submit" sx={{ marginRight: 1 }}>
              Create
            </Button>
            <Link href="/stock" passHref>
              <Button variant="outlined" fullWidth>
                Cancl
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Form>
    );
  };

  const showPreviewImage = (values: any) => {
    if (values.file_obj) {
      return <Image alt="product image" src={values.file_obj} width={100} height={100} />;
    }
  };

  const initialValues: ProductData = { name: "", stock: 100, price: 100 };

  return (
    <Layout>
      <Formik
        validate={(values) => {
          let errors: any = {};
          if (!values.name) errors.name = "Enter name";
          if (values.stock < 10) errors.stock = "Min stock is not lower than 10";
          if (values.price < 100) errors.price = "Min price is not lower than 100";
          return errors;
        }}
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          let data = new FormData();
          data.append("name", values.name);
          data.append("price", String(values.price));
          data.append("stock", String(values.stock));
          data.append("image", values.file);
          await addProduct(data);
          router.push("/stock");
          setSubmitting(false);
        }}
      >
        {(props) => showForm(props)}
      </Formik>
    </Layout>
  );
};

export default AddStock;
