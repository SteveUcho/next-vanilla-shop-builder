import { ObjectId } from 'mongodb';
import Link from 'next/link';
import { FC } from 'react';
import UserLayout from '../../../components/userProfile/UserLayout';
import clientPromise from '../../../lib/mongodb';
import { User, userWidget } from '../../../types/UserTypes';

interface UserWidgetProps {
    userData: User
    userWidgets: userWidget[]
}

const UserWigets: FC<UserWidgetProps> = function UserWidgets({
    userData,
    userWidgets
}) {
    return (
        <UserLayout user={userData}>
            <div>
                <h1>Widgets</h1>
                {
                    userWidgets.map((widget) => {
                        return (
                            <div key={widget._id}>
                                <Link href={"/" + userData._id + "/widgets/" + widget._id}>
                                    <a>
                                        {widget.name}
                                    </a>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </UserLayout>
    )
}

export async function getStaticProps({ params }) {
    const connection = await clientPromise;

    // get userWidgets
    const testDB = connection.db('test');
    const usersCollection = testDB.collection('users');
    const userData = await usersCollection.findOne({ _id: new ObjectId(params.userID) });
    const updatedUserData = {
        ...userData,
        _id: userData._id.toString()
    }

    // get userWidgets
    const shopBuilderDB = connection.db('shopBuilder');
    const catalogCollection = shopBuilderDB.collection('catalog');
    const tempWidgets = catalogCollection.find({ creatorID: new ObjectId(params.userID) });
    const userWidgets = await tempWidgets.toArray();
    const userWidgetsUpdated = userWidgets.map((userWidget) => {
        return ({
            ...userWidget,
            _id: userWidget._id.toString(),
            creatorID: userWidget.creatorID.toString()
        })
    })

    return {
        props: { userData: updatedUserData, userWidgets: userWidgetsUpdated },
    }
}

export async function getStaticPaths() {
    const connection = await clientPromise;

    const testDB = connection.db('test');
    const usersCollection = testDB.collection('users');

    const tempIDs = usersCollection.find({}).project({ _id: 1 });
    const userIDs = await tempIDs.toArray();

    const resIDs = userIDs.map((idObj: { _id: ObjectId }) => {
        return idObj._id.toString();
    });

    const pathsObjs = resIDs.map((userID) => {
        return ({
            params: {
                userID: userID
            }
        })
    })
    return {
        paths: pathsObjs,
        fallback: true // false or 'blocking'
    };
}

export default UserWigets;