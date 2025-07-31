import React from "react";
import { useMutation } from "react-query";
import ApiService from "@/components/logic/ApiService";
import Responsebar from "@/components/interface/responsebar/responsebar";
import { useRouter } from "next/router";

export default function Response({
  data, // Data for the request
  method, // HTTP method (e.g., 'create', 'update', 'delete', etc.)
  root, // API endpoint root
  id = undefined, // Specific element ID for 'update' or 'delete'
  push = false, // Option to push to a different URL after a successful request
  url, // Page URL to push to
  children, // React elements to render within the component
}) {
  const router = useRouter();
  const apiService = new ApiService(root, id);
  const mutation = useMutation(() => apiService[method](data));

  if (mutation.isSuccess) {
    if (push && mutation.isSuccess) {
      const redirectTo = id
        ? `/${url}/${mutation.data.data.data.id}`
        : `/${url}`;
      router.push(redirectTo);
    }
  }
  // console.log(mutation.data?.data?.data);

  return (
    <div onClick={mutation.mutate}>
      {mutation.isPaused ? (
        <Responsebar
          isError={mutation.isError}
          isLoading={mutation.isLoading}
        />
      ) : (
        <></>
      )}
      {children}
    </div>
  );
}
