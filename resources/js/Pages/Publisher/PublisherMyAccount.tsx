import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import MyAccount from "../Auth/MyAccount";
import PublisherLayout from "@/Layouts/PublisherLayout";

export default function PublisherMyAccount( {auth} : PageProps ) {

    return (

        <>
            <Head title="My Account"></Head>
            <MyAccount auth={auth}></MyAccount>
        </>
    )
}


PublisherMyAccount.layout = (page:any) => <PublisherLayout user={page.props.auth.user}>{page}</PublisherLayout>
