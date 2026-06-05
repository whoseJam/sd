#include<bits/stdc++.h>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=105;
int R,C,a[N][N],mxlen[N][N];
int dx[4]={0,1,0,-1};
int dy[4]={1,0,-1,0};

int walk(int x,int y){
	if(mxlen[x][y]!=-1){
		return mxlen[x][y];
	}
	int len=1;
	for(int i=0;i<=3;i++){
		int tx=x+dx[i];
		int ty=y+dy[i];
		if(1<=tx&&tx<=R&&1<=ty&&ty<=C&&a[x][y]>a[tx][ty]){
			len=max(len,walk(tx,ty)+1);
		}
	}
	mxlen[x][y]=len;
	return len;
}

int main(){
	R=read();C=read();
	for(int i=1;i<=R;i++)
		for(int j=1;j<=C;j++){
			a[i][j]=read();
			mxlen[i][j]=-1;
		}
	int ans=0;
	for(int i=1;i<=R;i++)
		for(int j=1;j<=C;j++){
			ans=max(ans,walk(i,j));
		}
	cout<<ans;
	return 0;
}

