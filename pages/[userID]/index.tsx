import { ObjectId } from 'mongodb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Container } from 'react-bootstrap'
import UserLayout from '../../components/userProfile/UserLayout'
import clientPromise from '../../lib/mongodb'
import { User } from '../../types/UserTypes'

interface UserProfileProps {
    userData: User
}

const UserProfile: FC<UserProfileProps> = ({
    userData
}) => {
    return (
        <Container>
            <UserLayout user={userData}>
                <div>
                    <h1>User Profile</h1>
                    <p><Link href={"/" + userData._id + "/widgets"}><a>See User Widgets</a></Link></p>
                </div>
            </UserLayout>
        </Container>
    )
}

export async function getStaticProps({ params }) {
    const connection = await clientPromise;
    
    // get userWidgets
    const testDB = connection.db('test');
    const usersCollection = testDB.collection('users');
    const userData = await usersCollection.findOne({_id: new ObjectId(params.userID)});
    const updatedUserData = {
        ...userData,
        _id: userData._id.toString()
    }

    return {
        props: { userData: updatedUserData},
    }
}

export async function getStaticPaths() {
    const connection = await clientPromise;
    
    const testDB = connection.db('test');
    const usersCollection = testDB.collection('users');

    const tempIDs = usersCollection.find({}).project({_id: 1});
    const userIDs = await tempIDs.toArray();

    const resIDs = userIDs.map((idObj: {_id: ObjectId}) =>{
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

export default UserProfile;