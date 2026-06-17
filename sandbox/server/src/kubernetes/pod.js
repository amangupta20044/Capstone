export { k8sCoreV1Api } from "./config";

export async function createPod(sandboxId) {
    const podManifest = {
        apiVersion: "v1",
        kind: "Pod",

        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                app: "sandbox",
                sandboxId: sandboxId
            }
        },

        spec: {
            volumes: [
                {
                    name: "workspace-volume",
                    emptyDir: {}
                }
            ],
            // initContainers are executed before the main containers start. They can be used to set up the environment, such as copying files or setting permissions.
            initContainers: [
                {
                    name: "init-container",
                    image: "template",
                    imagePullPolicy: "IfNotPresent",
                    command: ["sh", "-c", "cp -r /workspace/. /seed/"],
                    volumeMounts: [
                        {   
                            name: "workspace-volume",
                            mountPath: "/seed"
                        }
                    ]
                }
            ],
            containers: [
                {
                    name: "sandbox-container",
                    image: "template",
                    imagePullPolicy: "IfNotPresent",

                    ports: [
                        {
                            containerPort: 5173,
                            name: "http"
                        }
                    ],

                    resources: {
                        limits: {
                            cpu: "500m",
                            memory: "1Gi"
                        },
                        requests: {
                            cpu: "250m",
                            memory: "500Mi"
                        }
                    },
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ]
                },

                {
                    name: "agent-container",
                    image: "agent",
                    imagePullPolicy: "IfNotPresent",

                    ports: [
                        {
                            containerPort: 3000,
                            name: "http"
                        }
                    ],

                    resources: {
                        limits: {
                            cpu: "500m",
                            memory: "1Gi"
                        },
                        requests: {
                            cpu: "250m",
                            memory: "500Mi"
                        }
                    },
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ]
                }
            ]
        }
    };

    try {
        const response = await k8sCoreV1Api.createNamespacedPod({
            namespace: "default",
            body: podManifest
        });

        return response;
    } catch (error) {
        console.error("Error creating pod:", error);
        throw error;
    }
}