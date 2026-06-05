#include<iostream>
#include<cstring>
using namespace std;
const int N=1000005;
int nxt[N],n,m;
char A[N];
char B[N];

void Prepare(){
	nxt[1]=0;
	int cur=0; 
	for(int i=2;i<=n;i++){
		while(cur&&A[cur+1]!=A[i])
			cur=nxt[cur];
		if(A[cur+1]==A[i])nxt[i]=++cur;
		else nxt[i]=0;
	}
} 

int main(){
	scanf("%s",B+1);
	scanf("%s",A+1);
	n=strlen(A+1);
	m=strlen(B+1);
	Prepare();
	
	int cur=0;
	for(int i=1;i<=m;i++){
		while(cur>0&&A[cur+1]!=B[i])
			cur=nxt[cur];
		if(A[cur+1]==B[i])cur++;
		if(cur==n)cout<<i-n+1<<'\n';
	}
	for(int i=1;i<=n;i++)
		cout<<nxt[i]<<' ';
	return 0;
}
