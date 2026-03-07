import PublisherLayout from "@/Layouts/PublisherLayout";
import { Head } from "@inertiajs/react";

import ChangePassword from "../Auth/ChangePassword";

export default function PublisherChangePassword(  ) {

    return (

        <>
            <Head title="Change Password"></Head>
            <ChangePassword></ChangePassword>
        </>
    )
}

PublisherChangePassword.layout = (page:any) => <PublisherLayout user={page.props.auth.user}>{page}</PublisherLayout>
