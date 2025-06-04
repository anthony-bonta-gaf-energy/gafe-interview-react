import Button from '@/components/Button';
import Input from '@/components/Input';

function UserPage() {
  const handleSubmit = event => {
    event.preventDefault();
    console.log('Form submitted');
  };
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 my-4 py-2 border-b-2 border-gray-200">
        User Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="First Name" required placeholder="Enter first name" />
        <Input label="Last Name" required placeholder="Enter last name" />
        <Input label="Email" required placeholder="Enter email address" type="email" />
        <Input label="Phone Number" required placeholder="Enter phone number" type="tel" />
        <Button
          text="Save"
          type="submit"
          color="blue"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        />
      </form>
    </>
  );
}

export default UserPage;
