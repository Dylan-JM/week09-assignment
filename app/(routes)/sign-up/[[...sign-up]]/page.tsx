//TODO: render a sign-up page
//- Clerk component
//- A form to collect other user data (bio, nickname, location, interests...)
//- Insert user's data into users table, so we cna render it in the profile page

//Extra: create another nested route called createProfile where the user cqan complete their personal info as a second step in the sign-up process

export default function SignUpPage() {
  return (
    <>
      {/* Clerk component */}
      <form>
        <input type="text" name="nickname" />
        <textarea type="text" name="bio" />
        <input type="number" name="age" />
      </form>
    </>
  );
}
