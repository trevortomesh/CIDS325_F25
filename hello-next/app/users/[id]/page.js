export default async function UserDetailPage({ params }) {
  const { id } = await params;
  const users = {
    1: 'Alice',
    2: 'Bobbert',
    3: 'Chuckithan',
  };

  const name = users[id] || 'Unknown User';

  return (
    <>
      <h1>User Detail</h1>
      <p>ID: {id}</p>
      <p>Name: {name}</p>
    </>
  );
}
