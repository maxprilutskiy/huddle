import { Button, Card, CardBody, Input, Spacer } from "@nextui-org/react";
import { useState } from "react";

export default function App() {
  const [loading] = useState(false);

  return (
    <main>
      <Card
        isBlurred
        className="p-4 border border-foreground-100 max-w-md transform translate-y-[-50%] translate-x-[-50%] top-1/2 left-1/2"
        shadow="sm"
      >
        <CardBody>
          <Spacer y={4} />
          <h1 className="text-center text-3xl font-semibold">
            Relescope
          </h1>
          <Spacer y={2} />
          <p className="text-center text-foreground-400">
            Log in to continue
          </p>
          <Spacer y={6} />
          <Input name="email" type="email" variant="bordered" label="Email" />
          <Spacer y={4} />
          <Input name="password" type="password" variant="bordered" label="Password" />
          <Spacer y={6} />
          <Button color="success" variant="flat" size="lg" isLoading={loading}>
            Login
          </Button>
          <Spacer y={2} />
        </CardBody>
      </Card>
    </main>
  );
}
