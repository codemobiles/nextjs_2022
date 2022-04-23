import { doGetStockById } from "@/services/serverService";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";

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
import { editProduct } from "@/services/serverService";
import { productImageURL } from "@/utils/commonUtil";
import Layout from "@/components/Layouts/Layout";

type Props = {
  product: ProductData;
};

const AddStock = ({ product }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const showForm = ({ values, setFieldValue }: FormikProps<ProductData>) => {
    return (
      <Form>
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <Typography gutterBottom variant="h3">
              Edit Stock
            </Typography>

            <Field style={{ marginTop: 16 }} fullWidth component={TextField} name="name" type="text" label="Name" />
            <br />
            <Field style={{ marginTop: 16 }} fullWidth component={TextField} name="price" type="number" label="Price" />

            <Field style={{ marginTop: 16 }} fullWidth component={TextField} name="stock" type="number" label="Stock" />

            <div style={{ margin: 16 }}>{showPreviewImage(values)}</div>

            <div>
              <Image objectFit="cover" alt="product image" src="/static/img/ic_photo.png" width={25} height={20} />
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
              Edit
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
      return <Image objectFit="contain" alt="product image" src={values.file_obj} width={100} height={100} />;
    } else if (values.image) {
      return <Image objectFit="contain" alt="product image" src={productImageURL(values.image)} width={100} height={100} />;
    }
  };

  return (
    <Layout>
      <Formik
        validate={(values) => {
          let errors: any = {};
          if (!values.name) errors.name = "Enter name";
          if (values.stock < 3) errors.stock = "Min stock is not lower than 3";
          if (values.price < 3) errors.price = "Min price is not lower than 3";
          return errors;
        }}
        initialValues={product}
        onSubmit={async (values, { setSubmitting }) => {
          let data = new FormData();
          data.append("id", String(values.id));
          data.append("name", values.name);
          data.append("price", String(values.price));
          data.append("stock", String(values.stock));
          if (values.file) {
            data.append("image", values.file);
          }
          await editProduct(data);
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

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id }: any = context.query;
  if (id) {
    const product = await doGetStockById(id);
    return {
      props: {
        product,
      },
    };
  } else {
    return { props: {} };
  }
};
