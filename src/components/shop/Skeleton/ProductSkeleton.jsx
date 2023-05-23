import React from "react";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import styles from "./ProductSkeleton.module.scss";

export const ProductSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <Stack spacing={1}>
        <Skeleton variant="rectangular" width="80%" height={300} />
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonInfo}>
            <Skeleton variant="text" width="80%" height={45} />
            <Skeleton variant="text" width="60%" height={45} />
          </div>
        </div>
      </Stack>
    </div>
  );
};